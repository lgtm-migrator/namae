const fetch = require('isomorphic-unfetch')

async function getAvailability(name) {
  try {
    const response = await fetch(
      `https://${encodeURIComponent(name)}.slack.com`
    )
    return response.status !== 200
  } catch (err) {
    if (err.code === 'ENOTFOUND') {
      return true
    } else {
      throw new Error(err.message)
    }
  }
}

module.exports = async (req, res) => {
  const name = req.query.name

  if (!name) {
    return res.status(400).json({ error: 'no query given' })
  }

  try {
    const availability = await getAvailability(name)
    res.json({ availability })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}
