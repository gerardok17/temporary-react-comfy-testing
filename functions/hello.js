// domain/.netlify/functions/hello . i.e: http://localhost:8888/.netlify/functions/hello

const items = [
  { id: 1, name: 'gerardo' },
  { id: 2, name: 'susan' },
]

exports.handler = async (event, cnotext) => {
  return {
    statusCode: 200,
    body: JSON.stringify(items),
  }
}
