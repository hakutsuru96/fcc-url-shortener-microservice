
var BASE_URL = 'https://profuse-elk.glitch.me/'
function create(db, url, callback) {
  db.collection('urls', function(err, col) {
    if (err) throw err
    col.findOne({ original_url: url }, {}, function(err, res) {
      if (err) throw err
      if (!res) {
        col.count(function(err, num) {
          if (err) throw err
          col.insert({
            original_url: url,
            short_url: BASE_URL + (num + 1)
          }, function(err, doc) {
            if (err) throw err
            callback(doc.ops[0])
          })
        })
      } else {
        callback(res)
      }
    })
  })
}

function getOriginalUrl(db, id, callback) {
  db.collection('urls', function(err, col) {
    if (err) throw err
    col.findOne({
      short_url: BASE_URL + id
    }, function(err, res) {
      // if (err) throw err
      callback(res ? res.original_url : null)
    })
  })
}

module.exports = { create, getOriginalUrl }