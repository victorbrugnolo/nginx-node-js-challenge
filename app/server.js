const db_config = require("./db_config.json")
const express = require('express')
const mysql = require('mysql')
const random_name = require('node-random-name')
const util = require('util')

const connection = mysql.createConnection(db_config)

const app = express()
const port = 3000;
const query = util.promisify(connection.query).bind(connection)


const insert_name = async () => {
    const insert_name_sql = `INSERT INTO people(name) values('${random_name()}')`

    await query(insert_name_sql)
}

const get_people = async () => {
    const get_people_sql = `SELECT * FROM people`
    const people = await query(get_people_sql)

    return people;
}

const buildResponse = (people) => {
    let title = '<h1> Full Cycle Rocks!</h1>'

    title += '<h2>Lista de nomes cadastrada no banco de dados</h2>'
    title += '<ul>'

    for (const person of people) {
        title += `<li>${person.name}</li>`
    }

    title += '</ul>'

    return title
}

app.get('/', async (_, res) => {
    await insert_name()
    const people = await get_people()
    res.send(buildResponse(people))
})


app.listen(port, () => {
    console.log('🚀 Listening on port', port, '🚀');
});