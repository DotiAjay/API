const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())
const dbPath = path.join(__dirname, 'goodreads.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()
// get
app.get('/players/', (request, response) => {
  const dbquery = `
  select player_name from cricket_team ;`
  const player = db.all(dbquery)
  response.send(player)
})
// post
app.post('/players/', async (request, response) => {
  const adding = request.body
  const {player_id, player_name, jersey_number, role} = adding
  const addingpost = `
  insert into  cricket_team (player_id, player_name, jersey_number,role)
  values {
    ${player_id},
    ${player_name},
    ${jersey_number}.
    ${role}
  };
  
  `
  const dbadding = await db.run(addingpost)
  response.send('Player Added to Team')
})
// geting a player
app.get('/players/:playerId', async (response, request) => {
  const player_id = request.params
  const getQuery = `
  select * from cricket_team where 
  player_id = ${player_id};
  `
  const player_by_id = await db.get(getQuery)
  response.send(player_by_id)
})
// put method
app.put('/players/:playerId', async (response, request) => {
  const id = request.params
  const playerDetails = request.body
  const {player_id, player_name, jersey_number, role} = playerDetails

  const updateQuery = `
  update cricket_team 
  set 
  player_id =${player_id},
  player_name =${player_name},
  jersy_number =${jersey_number},
  role = ${role};
  
  `
  const playerupdated = await db.run(updateQuery)
  response.send('Player Details Updated')
})
// delete
app.delete('/playerss/:playerId', async (response, request) => {
  const id = request.params
  const getQuery = `
delete from cricket_team where
  player_id = ${id};
  `
  const player_by_id = await db.get(getQuery)
  response.send('Player Removed')
})

module.exports = app 
