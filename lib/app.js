const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const { findById } = require('../data/dataUtils.js');
const categories = require('../data/category-data.js')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
    res.json({
        message: `in this proctected route, we get the user's id like so: ${req.userId}`
    });
});
//all modules endpoint
app.get('/modules', async (req, res) => {
    try {
        const data = await client.query(
            `SELECT 
                modules.*,
                categories.category_name
            FROM modules
            JOIN categories
            ON modules.category_id = categories.id`
        );

        res.json(data.rows);
    } catch (e) {

        res.status(500).json({ error: e.message });
    }
});
// all categories endpoint
app.get('/categories', async (req, res) => {
    try {
        const data = await client.query(
            `SELECT *
            FROM categories`
        );

        res.json(data.rows);
    } catch (e) {

        res.status(500).json({ error: e.message });
    }
});
//module by id endpoint
app.get('/modules/single/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await client.query(
            `SELECT 
            modules.*,
            categories.category_name
            FROM modules
            JOIN categories
            ON modules.category_id = categories.id
            WHERE modules.id=$1`, [id]);
        res.json(data.rows);
    } catch (e) {

        res.status(500).json({ error: e.message });
    }
});
//modules sorted by price
app.get('/sorted/:sortby', async (req, res) => {
    const sortBy = req.params.sortby;
    try {
        const data = await client.query(
            `SELECT 
            modules.*,
            categories.category_name
            FROM modules
            JOIN categories
            ON modules.category_id = categories.id
            ORDER BY ${sortBy}`);

        res.json(data.rows);
    } catch (e) {

        res.status(500).json({ error: e.message });
    }
});
//only modules with in_stock set to true
app.get('/instock', async (req, res) => {
    try {
        const data = await client.query(
            `SELECT 
            modules.*,
            categories.category_name
            FROM modules
            JOIN categories
            ON modules.category_id = categories.id
            WHERE in_stock = true`);

        res.json(data.rows);
    } catch (e) {

        res.status(500).json({ error: e.message });
    }
});
//insert a new module
app.post('/modules', async (req, res) => {

    try {
        // const categoriesResponse = await client.query(
        //     `SELECT * FROM categories`);

        // console.log(categoriesResponse);
        // console.log(categoriesResponse.rows)



        // const categoryId = findById(req.body.category, categoriesResponse.rows);

        const data = await client.query(
            `INSERT INTO modules
            (brand, module_name, image, category_id, size, description, price, in_stock, owner_id)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8 ,$9)
            RETURNING *`, [req.body.brand, req.body.module_name, req.body.image, req.body.category_id, req.body.size, req.body.description, req.body.price, req.body.in_stock, 1]);

        res.json(data.rows[0]);

    } catch (e) {
        res.status(500).json({ message: e.message })
    }
});
//update a single modules data
app.put('/modules/single/:id', async (req, res) => {
    try {

        const moduleId = req.params.id;

        const data = await client.query(`
            UPDATE modules
            SET brand=$1, module_name=$2, image=$3, category_id=$4, size=$5, description=$6, price=$7, in_stock=$8, owner_id=$9
            WHERE id=$4
            RETURNING *`,[req.body.brand, req.body.module_name, req.body.image, req.body.category_Id, req.body.size, req.body.description, req.body.price, req.body.in_stock, 1] );

        res.json(data.rows[0]);

    } catch (e) {
        res.status(500).json({ message: e.message })
    }
});
//delete a module from the array
app.delete('/modules/single/:id', async (req, res) => {
    try {

        const thisModule = req.params.id;

        const data = await client.query(`
            DELETE FROM modules
            WHERE id=$1
            `, [thisModule]);

        res.json(data.rows[0]);

    } catch (e) {

        res.status(500).json({ message: e.message })
    }
});
//get modules by category
app.get('/category/:category', async (req, res) => {
    const thisCategory = req.params.category;
    try {
        const data = await client.query(
            `SELECT 
            modules.*,
            categories.category_name
            FROM modules
            JOIN categories
            ON modules.category_id = categories.id
            WHERE categories.category_name = $1`, [thisCategory]);

        res.json(data.rows);
    } catch (e) {

        res.status(500).json({ error: e.message });
    }
});


app.use(require('./middleware/error'));

module.exports = app;
