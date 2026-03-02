export default function handler(req, res) {
  res.status(200).json({
    app: 'StudyBuddy',
    status: 'ok',
    message: 'StudyBuddy API routes are online.',
  })
}
