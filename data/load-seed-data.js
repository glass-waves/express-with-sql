const client = require('../lib/client');
// import our seed data:
const modules = require('./modules.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');
const categories = require('./category-data.js')

run();

async function run() {

    try {
        await client.connect();

        const users = await Promise.all(
            usersData.map(user => {
                return client.query(`
                    INSERT INTO users (email, hash)
                    VALUES ($1, $2)
                    RETURNING *;
                    `, 
                    [user.email, user.hash]);
            })
        );

        const user = users[0].rows[0];

        await Promise.all(
            categories.map(module => {
                return client.query(`
                    INSERT INTO categories (category_name)
                    VALUES ($1)
                    RETURNING *;
                `,
                    [categories.category_name]);
            })
        );

        await Promise.all(
            modules.map(module => {
                return client.query(`
                    INSERT INTO modules (_id, brand, module_name, image, category_id, size, description, price, in_stock, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
                `,
                    [module._id, module.brand, module.moduleName, module.image, module.category_id, module.size, module.description, module.price, module.inStock, user.id]);
            })
        );


        console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }

}
