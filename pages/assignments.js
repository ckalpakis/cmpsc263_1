/* Assignments page for creating, editing, completing, reading, and deleting persisted study tasks. */
import React, { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import AppLayout from '@/components/Layout/AppLayout'
import { useStateContext } from '@/context/StateContext'
import {
  createAssignment,
  getAssignments,
  removeAssignment,
  updateAssignment,
} from '@/backend/Database'

const initialForm = {
  title: '',
  dueDate: '',
  description: '',
}

const Assignments = () => {
  const { user, authReady, authMode } = useStateContext()
  const ownerId = user?.uid || 'guest'

  const [assignments, setAssignments] = useState([])
  const [formValues, setFormValues] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!authReady) {
      return
    }

    let isMounted = true

    async function loadAssignmentsList() {
      setIsLoading(true)
      setError('')

      try {
        const records = await getAssignments(ownerId)
        if (isMounted) {
          setAssignments(records)
        }
      } catch (loadError) {
        if (isMounted) {
          setAssignments([])
          setError('Unable to load assignments right now.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadAssignmentsList()

    return () => {
      isMounted = false
    }
  }, [authReady, ownerId])

  const orderedAssignments = useMemo(
    () => [...assignments].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [assignments]
  )

  function resetForm() {
    setFormValues(initialForm)
    setEditingId(null)
  }

  function handleFieldChange(field, value) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setStatusMessage('')

    if (!formValues.title.trim()) {
      setError('Title is required.')
      return
    }

    if (!formValues.dueDate) {
      setError('Due date is required.')
      return
    }

    setIsSaving(true)

    const payload = {
      title: formValues.title.trim(),
      dueDate: formValues.dueDate,
      description: formValues.description.trim(),
      completed: false,
    }

    try {
      if (editingId) {
        const currentRecord = assignments.find((assignment) => assignment.id === editingId)
        const updatedAssignment = await updateAssignment(ownerId, editingId, {
          ...payload,
          completed: currentRecord?.completed || false,
        })

        setAssignments((currentAssignments) =>
          currentAssignments.map((assignment) =>
            assignment.id === editingId ? { ...assignment, ...updatedAssignment } : assignment
          )
        )
        setStatusMessage('Assignment updated successfully.')
      } else {
        const newAssignment = await createAssignment(ownerId, payload)
        setAssignments((currentAssignments) => [...currentAssignments, newAssignment])
        setStatusMessage('Assignment created successfully.')
      }

      resetForm()
    } catch (saveError) {
      setError('Unable to save the assignment right now.')
    } finally {
      setIsSaving(false)
    }
  }

  function handleEdit(assignment) {
    setEditingId(assignment.id)
    setFormValues({
      title: assignment.title,
      dueDate: assignment.dueDate,
      description: assignment.description || '',
    })
    setStatusMessage('Editing assignment.')
  }

  async function handleDelete(assignmentId) {
    setError('')
    setStatusMessage('')

    try {
      await removeAssignment(ownerId, assignmentId)
      setAssignments((currentAssignments) =>
        currentAssignments.filter((assignment) => assignment.id !== assignmentId)
      )
      if (editingId === assignmentId) {
        resetForm()
      }
      setStatusMessage('Assignment deleted.')
    } catch (deleteError) {
      setError('Unable to delete the assignment right now.')
    }
  }

  async function handleToggleComplete(assignment) {
    setError('')
    setStatusMessage('')

    try {
      const updatedAssignment = await updateAssignment(ownerId, assignment.id, {
        title: assignment.title,
        dueDate: assignment.dueDate,
        description: assignment.description || '',
        completed: !assignment.completed,
      })

      setAssignments((currentAssignments) =>
        currentAssignments.map((item) =>
          item.id === assignment.id ? { ...item, ...updatedAssignment } : item
        )
      )
      setStatusMessage(updatedAssignment.completed ? 'Assignment marked complete.' : 'Assignment reopened.')
    } catch (updateError) {
      setError('Unable to update that assignment right now.')
    }
  }

  return (
    <AppLayout
      eyebrow='Assignments'
      title='Capture work once, then keep it moving.'
      description='This page demonstrates persistent database reads and writes. Signed-in Firebase users store to Firestore, while guests and demo users store locally so the workflow remains fully usable.'
      actions={<ModePill>{user && authMode === 'firebase' ? 'Firestore sync' : 'Local persistence'}</ModePill>}
    >
      <Panels>
        <FormCard onSubmit={handleSubmit}>
          <SectionHeader>{editingId ? 'Edit assignment' : 'Add assignment'}</SectionHeader>

          <Field>
            <Label>Title</Label>
            <Input
              id='title'
              type='text'
              value={formValues.title}
              onChange={(event) => handleFieldChange('title', event.target.value)}
              placeholder='Read chapter 4 notes'
            />
          </Field>

          <Field>
            <Label>Due date</Label>
            <Input
              id='dueDate'
              type='date'
              value={formValues.dueDate}
              onChange={(event) => handleFieldChange('dueDate', event.target.value)}
            />
          </Field>

          <Field>
            <Label>Description</Label>
            <TextArea
              id='description'
              value={formValues.description}
              onChange={(event) => handleFieldChange('description', event.target.value)}
              placeholder='Include requirements, links, or steps...'
            />
          </Field>

          {error && <ErrorText>{error}</ErrorText>}
          {statusMessage && !error && <StatusText>{statusMessage}</StatusText>}

          <ButtonRow>
            <PrimaryButton type='submit' disabled={isSaving}>
              {isSaving ? 'Saving...' : editingId ? 'Update Assignment' : 'Add Assignment'}
            </PrimaryButton>
            {editingId && (
              <SecondaryButton type='button' onClick={resetForm}>
                Cancel
              </SecondaryButton>
            )}
          </ButtonRow>
        </FormCard>

        <ListCard>
          <SectionHeader>Your assignments</SectionHeader>
          <SubtleText>{user ? `Signed in as ${user.email}` : 'Browsing as guest'}</SubtleText>

          {isLoading && <SubtleText>Loading assignments...</SubtleText>}
          {!isLoading && orderedAssignments.length === 0 && (
            <SubtleText>No assignments yet. Create your first task in the form.</SubtleText>
          )}

          <List>
            {orderedAssignments.map((assignment) => (
              <AssignmentItem key={assignment.id}>
                <LeftColumn>
                  <TitleRow>
                    <Title $completed={assignment.completed}>{assignment.title}</Title>
                    <DueDate>{assignment.dueDate}</DueDate>
                  </TitleRow>
                  {assignment.description && <Description>{assignment.description}</Description>}
                </LeftColumn>

                <ActionRow>
                  <ActionButton type='button' onClick={() => handleToggleComplete(assignment)}>
                    {assignment.completed ? 'Reopen' : 'Complete'}
                  </ActionButton>
                  <ActionButton type='button' onClick={() => handleEdit(assignment)}>
                    Edit
                  </ActionButton>
                  <DeleteButton type='button' onClick={() => handleDelete(assignment.id)}>
                    Delete
                  </DeleteButton>
                </ActionRow>
              </AssignmentItem>
            ))}
          </List>
        </ListCard>
      </Panels>
    </AppLayout>
  )
}

const ModePill = styled.span`
  border: 1px solid var(--line);
  background: var(--bg-soft);
  color: var(--muted);
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 0.8rem;
`

const Panels = styled.section`
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  gap: 14px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const baseCardStyles = css`
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: 18px;
`

const FormCard = styled.form`
  ${baseCardStyles}
  display: grid;
  gap: 12px;
  align-content: start;
`

const ListCard = styled.section`
  ${baseCardStyles}
`

const SectionHeader = styled.h2`
  font-size: 1.1rem;
`

const Field = styled.label`
  display: grid;
  gap: 6px;
`

const Label = styled.span`
  color: var(--muted);
  font-size: 0.88rem;
`

const Input = styled.input`
  width: 100%;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--bg-soft);
  padding: 10px;
  font: inherit;
`

const TextArea = styled.textarea`
  width: 100%;
  min-height: 110px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--bg-soft);
  padding: 10px;
  font: inherit;
  resize: vertical;
`

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const PrimaryButton = styled.button`
  border: 1px solid var(--accent);
  border-radius: var(--radius-sm);
  background: var(--accent);
  color: #fff;
  padding: 10px 12px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
`

const SecondaryButton = styled.button`
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
  padding: 10px 12px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
`

const ErrorText = styled.p`
  color: var(--danger);
  font-size: 0.92rem;
`

const StatusText = styled.p`
  color: var(--success);
  font-size: 0.92rem;
`

const SubtleText = styled.p`
  margin-top: 6px;
  color: var(--muted);
  font-size: 0.92rem;
`

const List = styled.div`
  margin-top: 16px;
  display: grid;
  gap: 10px;
`

const AssignmentItem = styled.article`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--bg-soft);
  padding: 12px;
`

const LeftColumn = styled.div`
  flex: 1;
  min-width: 220px;
`

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`

const Title = styled.h3`
  font-size: 1rem;
  text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
  opacity: ${({ $completed }) => ($completed ? 0.65 : 1)};
`

const DueDate = styled.span`
  color: var(--muted);
  font-size: 0.84rem;
`

const Description = styled.p`
  margin-top: 6px;
  color: var(--muted);
  font-size: 0.94rem;
`

const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const ActionButton = styled.button`
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
  padding: 8px 10px;
  font: inherit;
  cursor: pointer;
`

const DeleteButton = styled(ActionButton)`
  color: var(--danger);
  border-color: #dfb4b4;
`

export default Assignments
