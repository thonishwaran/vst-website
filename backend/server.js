require('dotenv').config();

const express = require('express');
const cors = require('cors');
const oracledb = require('oracledb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

// Test database connection
app.get('/api/health', async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        await connection.execute('SELECT 1 FROM DUAL');

        res.json({
            ok: true,
            service: 'VST API',
            database: 'connected'
        });

    } catch (error) {
        console.error('Database error:', error);

        res.status(503).json({
            ok: false,
            service: 'VST API',
            database: 'disconnected',
            error: error.message
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


// Get services
app.get('/api/services', async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `SELECT *
             FROM SERVICES
             ORDER BY SERVICE_ID`
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch services' });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


// Get projects
app.get('/api/projects', async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `SELECT *
             FROM PROJECTS
             ORDER BY CREATED_AT DESC`
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch projects' });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


// Create inquiry
app.post('/api/inquiries', async (req, res) => {

    const {
        name,
        email,
        phone,
        company,
        service_id,
        budget,
        message
    } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            error: 'Name, email and message are required'
        });
    }

    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `INSERT INTO INQUIRIES
            (NAME, EMAIL, PHONE, COMPANY, SERVICE_ID, BUDGET, MESSAGE)
            VALUES
            (:name, :email, :phone, :company, :service_id, :budget, :message)
            RETURNING INQUIRY_ID INTO :inquiry_id`,
            {
                name,
                email,
                phone: phone || null,
                company: company || null,
                service_id: service_id || null,
                budget: budget || null,
                message,
                inquiry_id: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.NUMBER
                }
            },
            {
                autoCommit: true
            }
        );

        res.status(201).json({
            ok: true,
            inquiry_id: result.outBinds.inquiry_id[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Failed to create inquiry'
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


// Authentication middleware
function auth(req, res, next) {

    try {

        const token =
            (req.headers.authorization || '')
            .replace('Bearer ', '');

        req.user = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        next();

    } catch {

        res.status(401).json({
            error: 'Unauthorized'
        });

    }
}


// Admin summary
app.get('/api/admin/summary', auth, async (req, res) => {

    let connection;

    try {

        connection = await oracledb.getConnection(dbConfig);

        const leadsResult = await connection.execute(
            `SELECT COUNT(*) AS TOTAL
             FROM INQUIRIES
             WHERE STATUS NOT IN ('WON','LOST')`
        );

        const newLeadsResult = await connection.execute(
            `SELECT COUNT(*) AS TOTAL
             FROM INQUIRIES
             WHERE STATUS = 'NEW'`
        );

        const projectsResult = await connection.execute(
            `SELECT COUNT(*) AS TOTAL
             FROM PROJECTS`
        );

        const recentResult = await connection.execute(
            `SELECT INQUIRY_ID,
                    NAME,
                    EMAIL,
                    STATUS,
                    PRIORITY,
                    CREATED_AT
             FROM INQUIRIES
             ORDER BY CREATED_AT DESC
             FETCH FIRST 8 ROWS ONLY`
        );

        res.json({
            leads: leadsResult.rows[0][0],
            newLeads: newLeadsResult.rows[0][0],
            projects: projectsResult.rows[0][0],
            recent: recentResult.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Failed to load admin summary'
        });

    } finally {

        if (connection) {
            await connection.close();
        }
    }
});


// Update inquiry
app.patch('/api/admin/inquiries/:id', auth, async (req, res) => {

    const { status, priority } = req.body;

    let connection;

    try {

        connection = await oracledb.getConnection(dbConfig);

        await connection.execute(
            `UPDATE INQUIRIES
             SET STATUS = NVL(:status, STATUS),
                 PRIORITY = NVL(:priority, PRIORITY)
             WHERE INQUIRY_ID = :id`,
            {
                status: status || null,
                priority: priority || null,
                id: Number(req.params.id)
            },
            {
                autoCommit: true
            }
        );

        res.json({
            ok: true
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Failed to update inquiry'
        });

    } finally {

        if (connection) {
            await connection.close();
        }
    }
});


app.listen(
    process.env.PORT || 5000,
    () => {
        console.log(
            `VST API running on ${process.env.PORT || 5000}`
        );
    }
);