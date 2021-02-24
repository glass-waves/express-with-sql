require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
    describe('routes', () => {
        let token;

        beforeAll(async done => {
            execSync('npm run setup-db');

            client.connect();

            const signInData = await fakeRequest(app)
                .post('/auth/signup')
                .send({
                    email: 'jon@user.com',
                    password: '1234'
                });

            token = signInData.body.token; // eslint-disable-line

            return done();
        });

        afterAll(done => {
            return client.end(done);
        });

        test('returns modules', async () => {

            const expectation = [
                {
                    "id": 7,
                    "_id": "sto",
                    "brand": "Make Noise",
                    "module_name": "STO Oscillator",
                    "image": "https://www.perfectcircuit.com/media/catalog/product/cache/956bc3d4a1f4832ce26f24b2860ea032/m/a/makenoise_sto-2021_01.jpg",
                    "category_id": 1,
                    "size": 8,
                    "description": "The STO is Make Noise's classic VCO. It is similar to a single channel of the DPO, but with a few adjustments. It has three outputs, a dedicated Sine output, a square wave Suboctave output, and a waveshaped output, which morphs from a soft triangle to something in between a Triangle and Square wave.",
                    "price": 199,
                    "in_stock": true,
                    "owner_id": 1,
                    "category_name": "oscillator"
                },
                {
                    "id": 1,
                    "_id": "chord",
                    "brand": "Qu-Bit",
                    "module_name": "Chord V2",
                    "image": "chord.jpg",
                    "category_id": 1,
                    "size": 14,
                    "description": "Chord v2 is a long-awaited update to the Qu-Bit’s original polyphonic oscillator. While gaining a tremendous reduction in HP size, the module kept all the beloved functionality of its predecessor and even attained a few new tricks up its sleeve.",
                    "price": 299,
                    "in_stock": true,
                    "owner_id": 1,
                    "category_name": "oscillator"
                },
                {
                    "id": 6,
                    "_id": "ripples",
                    "brand": "Mutable Instruments",
                    "module_name": "Ripples V2 Liquid Filter",
                    "image": "ripples.jpg",
                    "category_id": 2,
                    "size": 8,
                    "description": "Ripples from Mutable Instruments is an analog multi-mode filter that sounds huge and features two cutoff slopes. Ripples offers two inputs, one transparent and clean, and one with a drive control that can saturate and distort incoming signals. It even adds enough gain to bring line-level signals into your modular. Ripples includes a high pass, low pass, and band pass filter outputs. The band pass and low pass outputs are switchable between two and four-pole operation, giving two flavors of cutoff slope. The resonance setting sets the slope of the high pass filter.",
                    "price": 199,
                    "in_stock": false,
                    "owner_id": 1,
                    "category_name": "filter"
                },
                {
                    "id": 2,
                    "_id": "ikarie",
                    "brand": "BASTL",
                    "module_name": "Ikarie Stereo Filter",
                    "image": "ikarie.jpg",
                    "category_id": 2,
                    "size": 8,
                    "description": "The next collaboration between Bastl and Casper Electronics has landed, and the Ikarie Stereo Filter is ready for spacey resonances and interstellar spatial modulation. Rather than offering discrete outputs for lowpass and highpass like most state-variable filter designs, Ikarie will continuously morph between the two, and depending on how it is patched, an array of resonant bandpass or stereo notch filtering will be heard.",
                    "price": 259,
                    "in_stock": false,
                    "owner_id": 1,
                    "category_name": "filter"
                },
                {
                    "id": 4,
                    "_id": "maths",
                    "brand": "Make Noise",
                    "module_name": "Maths",
                    "image": "maths.jpg",
                    "category_id": 3,
                    "size": 20,
                    "description": "Make Noise Maths is a Control Voltage Generator and Processor indebted to the classic designs of Don Buchla in his Model 257 and Model 281 function generators. The design of Buchla's envelopes allowed them to easily switch between cycling and triggered envelopes, providing LFOs as well, and at high enough speeds, Oscillators. This design was then appropriated for the Serge Dual Universal Slope Generator, which is an apt name as it can basically create any kind of rising and falling voltage. Maths continues in this great tradition of versatile and function-packed modules.",
                    "price": 290,
                    "in_stock": false,
                    "owner_id": 1,
                    "category_name": "envelope"
                },
                {
                    "id": 3,
                    "_id": "zadar",
                    "brand": "XAOC Devices",
                    "module_name": "Zadar Quad Envelope",
                    "image": "zadar.jpg",
                    "category_id": 3,
                    "size": 10,
                    "description": "The XAOC Zadar is a widely configurable function generator which redefines the very notion of the modulation envelope. It consists of four independent channels which can be assigned functions made of up to 1000 segments and which can be warped, reversed, and stretched using the simple and intuitive menu system or via each channel’s assignable CV input. Each channel can output functions ranging in time from 0.08 milliseconds to 30 minutes and supports looping and chaining of waveforms, allowing for use as a complex FM source and LFO as well! With all this functionality and more in a mere 10hp, the Zadar is sure to breathe new life into any setup.",
                    "price": 330,
                    "in_stock": true,
                    "owner_id": 1,
                    "category_name": "envelope"
                },
                {
                    "id": 5,
                    "_id": "quad-vca",
                    "brand": "Intellijel",
                    "module_name": "Quad VCA",
                    "image": "quad-vca.jpg",
                    "category_id": 4,
                    "size": 12,
                    "description": "Intellijel’s brand new Quad VCA can be used as a four individual VCAs, or as a four-channel mixer. The module offers users the ability to route each individual channel to a separate destination in their system, or use the Mix out for a sum of all four signals. The module features a continually adjustable linear to exponential response curve, and a Boost switch that adds up to 6dB of gain to each channel. ",
                    "price": 189,
                    "in_stock": true,
                    "owner_id": 1,
                    "category_name": "vca"
                }
            ]

            const data = await fakeRequest(app)
                .get('/modules')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(data.body).toEqual(expectation);
        });

        test('returns one module corresponding to id', async () => {

            const expectation = [
                {
                    "id": 1,
                    "_id": "chord",
                    "brand": "Qu-Bit",
                    "module_name": "Chord V2",
                    "image": "chord.jpg",
                    "category_id": 1,
                    "size": 14,
                    "description": "Chord v2 is a long-awaited update to the Qu-Bit’s original polyphonic oscillator. While gaining a tremendous reduction in HP size, the module kept all the beloved functionality of its predecessor and even attained a few new tricks up its sleeve.",
                    "price": 299,
                    "in_stock": true,
                    "owner_id": 1,
                    "category_name": "oscillator"
                }
            ];

            const data = await fakeRequest(app)
                .get('/modules/single/1')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(data.body).toEqual(expectation);
        });

        test('returns modules sorted by price ascending', async () => {

            const expectation =
            [
                {
                    "id": 5,
                    "_id": "quad-vca",
                    "brand": "Intellijel",
                    "module_name": "Quad VCA",
                    "image": "quad-vca.jpg",
                    "category_id": 4,
                    "size": 12,
                    "description": "Intellijel’s brand new Quad VCA can be used as a four individual VCAs, or as a four-channel mixer. The module offers users the ability to route each individual channel to a separate destination in their system, or use the Mix out for a sum of all four signals. The module features a continually adjustable linear to exponential response curve, and a Boost switch that adds up to 6dB of gain to each channel. ",
                    "price": 189,
                    "in_stock": true,
                    "owner_id": 1,
                    "category_name": "vca"
                },
                {
                    "id": 7,
                    "_id": "sto",
                    "brand": "Make Noise",
                    "module_name": "STO Oscillator",
                    "image": "https://www.perfectcircuit.com/media/catalog/product/cache/956bc3d4a1f4832ce26f24b2860ea032/m/a/makenoise_sto-2021_01.jpg",
                    "category_id": 1,
                    "size": 8,
                    "description": "The STO is Make Noise's classic VCO. It is similar to a single channel of the DPO, but with a few adjustments. It has three outputs, a dedicated Sine output, a square wave Suboctave output, and a waveshaped output, which morphs from a soft triangle to something in between a Triangle and Square wave.",
                    "price": 199,
                    "in_stock": true,
                    "owner_id": 1,
                    "category_name": "oscillator"
                },
                {
                    "id": 6,
                    "_id": "ripples",
                    "brand": "Mutable Instruments",
                    "module_name": "Ripples V2 Liquid Filter",
                    "image": "ripples.jpg",
                    "category_id": 2,
                    "size": 8,
                    "description": "Ripples from Mutable Instruments is an analog multi-mode filter that sounds huge and features two cutoff slopes. Ripples offers two inputs, one transparent and clean, and one with a drive control that can saturate and distort incoming signals. It even adds enough gain to bring line-level signals into your modular. Ripples includes a high pass, low pass, and band pass filter outputs. The band pass and low pass outputs are switchable between two and four-pole operation, giving two flavors of cutoff slope. The resonance setting sets the slope of the high pass filter.",
                    "price": 199,
                    "in_stock": false,
                    "owner_id": 1,
                    "category_name": "filter"
                },
                {
                    "id": 2,
                    "_id": "ikarie",
                    "brand": "BASTL",
                    "module_name": "Ikarie Stereo Filter",
                    "image": "ikarie.jpg",
                    "category_id": 2,
                    "size": 8,
                    "description": "The next collaboration between Bastl and Casper Electronics has landed, and the Ikarie Stereo Filter is ready for spacey resonances and interstellar spatial modulation. Rather than offering discrete outputs for lowpass and highpass like most state-variable filter designs, Ikarie will continuously morph between the two, and depending on how it is patched, an array of resonant bandpass or stereo notch filtering will be heard.",
                    "price": 259,
                    "in_stock": false,
                    "owner_id": 1,
                    "category_name": "filter"
                },
                {
                    "id": 4,
                    "_id": "maths",
                    "brand": "Make Noise",
                    "module_name": "Maths",
                    "image": "maths.jpg",
                    "category_id": 3,
                    "size": 20,
                    "description": "Make Noise Maths is a Control Voltage Generator and Processor indebted to the classic designs of Don Buchla in his Model 257 and Model 281 function generators. The design of Buchla's envelopes allowed them to easily switch between cycling and triggered envelopes, providing LFOs as well, and at high enough speeds, Oscillators. This design was then appropriated for the Serge Dual Universal Slope Generator, which is an apt name as it can basically create any kind of rising and falling voltage. Maths continues in this great tradition of versatile and function-packed modules.",
                    "price": 290,
                    "in_stock": false,
                    "owner_id": 1,
                    "category_name": "envelope"
                },
                {
                    "id": 1,
                    "_id": "chord",
                    "brand": "Qu-Bit",
                    "module_name": "Chord V2",
                    "image": "chord.jpg",
                    "category_id": 1,
                    "size": 14,
                    "description": "Chord v2 is a long-awaited update to the Qu-Bit’s original polyphonic oscillator. While gaining a tremendous reduction in HP size, the module kept all the beloved functionality of its predecessor and even attained a few new tricks up its sleeve.",
                    "price": 299,
                    "in_stock": true,
                    "owner_id": 1,
                    "category_name": "oscillator"
                },
                {
                    "id": 3,
                    "_id": "zadar",
                    "brand": "XAOC Devices",
                    "module_name": "Zadar Quad Envelope",
                    "image": "zadar.jpg",
                    "category_id": 3,
                    "size": 10,
                    "description": "The XAOC Zadar is a widely configurable function generator which redefines the very notion of the modulation envelope. It consists of four independent channels which can be assigned functions made of up to 1000 segments and which can be warped, reversed, and stretched using the simple and intuitive menu system or via each channel’s assignable CV input. Each channel can output functions ranging in time from 0.08 milliseconds to 30 minutes and supports looping and chaining of waveforms, allowing for use as a complex FM source and LFO as well! With all this functionality and more in a mere 10hp, the Zadar is sure to breathe new life into any setup.",
                    "price": 330,
                    "in_stock": true,
                    "owner_id": 1,
                    "category_name": "envelope"
                }
            ]

            const data = await fakeRequest(app)
                .get('/sorted')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(data.body).toEqual(expectation);
        });

        test('adds one module to the database according to req.body data', async () => {

            const newModule = {
                "_id": "beads",
                "brand": "Mutable Instruments",
                "module_name": "Beads",
                "image": "https://www.perfectcircuit.com/media/catalog/product/cache/31f4f069f336eca018319f55f291a10e/M/u/MutableInstruments_Beads_01.jpg",
                "category": 'oscillator',
                "size": 14,
                "description": "The Clouds clear, and a new day is upon us: Mutable Instruments is back with the successor to their highly sought-after Clouds texture synthesizer, Beads. Beads's theoretical approach remains the same—it is a real-time granular processor, but the improvements over the original module are vast. Higher audio quality, improved interpolation and anti-aliasing, longer buffer, and a faster DSP sampling rate make this a worthy successor.",
                "price": 359,
                "in_stock": true,
                
            }
            const expectation = {
                "id": 8,
                "_id": "beads",
                "brand": "Mutable Instruments",
                "module_name": "Beads",
                "image": "https://www.perfectcircuit.com/media/catalog/product/cache/31f4f069f336eca018319f55f291a10e/M/u/MutableInstruments_Beads_01.jpg",
                "size": 14,
                "category_id": 1,
                "description": "The Clouds clear, and a new day is upon us: Mutable Instruments is back with the successor to their highly sought-after Clouds texture synthesizer, Beads. Beads's theoretical approach remains the same—it is a real-time granular processor, but the improvements over the original module are vast. Higher audio quality, improved interpolation and anti-aliasing, longer buffer, and a faster DSP sampling rate make this a worthy successor.",
                "price": 359,
                "in_stock": true,
                "owner_id": 1,
            }
            const expectation2 = {
                "id": 8,
                "_id": "beads",
                "brand": "Mutable Instruments",
                "module_name": "Beads",
                "image": "https://www.perfectcircuit.com/media/catalog/product/cache/31f4f069f336eca018319f55f291a10e/M/u/MutableInstruments_Beads_01.jpg",
                "category_id": 1,
                "size": 14,
                "description": "The Clouds clear, and a new day is upon us: Mutable Instruments is back with the successor to their highly sought-after Clouds texture synthesizer, Beads. Beads's theoretical approach remains the same—it is a real-time granular processor, but the improvements over the original module are vast. Higher audio quality, improved interpolation and anti-aliasing, longer buffer, and a faster DSP sampling rate make this a worthy successor.",
                "price": 359,
                "in_stock": true,
                "owner_id": 1,
                "category_name": "oscillator"
            }

            const data = await fakeRequest(app)
                .post('/modules')
                .send(newModule)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(data.body).toEqual(expectation);

            const allModules = await fakeRequest(app)
                .get('/modules')
                .expect('Content-type', /json/)
                .expect(200);

            const thisNewModule = allModules.body.find(module => module._id === 'beads');

            expect(thisNewModule).toEqual(expectation2);
        });

        test('updates module corresponding to id passed into the url', async () => {
            const newValues = {
                '_id': 'Beads',
                'size': 19,
                'price': 400
            }
            const expectation = [{
                "id": 8,
                "_id": "Beads",
                "brand": "Mutable Instruments",
                "module_name": "Beads",
                "image": "https://www.perfectcircuit.com/media/catalog/product/cache/31f4f069f336eca018319f55f291a10e/M/u/MutableInstruments_Beads_01.jpg",
                "category_id": 1,
                "size": 19,
                "description": "The Clouds clear, and a new day is upon us: Mutable Instruments is back with the successor to their highly sought-after Clouds texture synthesizer, Beads. Beads's theoretical approach remains the same—it is a real-time granular processor, but the improvements over the original module are vast. Higher audio quality, improved interpolation and anti-aliasing, longer buffer, and a faster DSP sampling rate make this a worthy successor.",
                "price": 400,
                "in_stock": true,
                "category_name": "oscillator",
                "owner_id": 1
            }];

            await fakeRequest(app)
                .put('/modules/single/8')
                .send(newValues)
                .expect('Content-Type', /json/)
                .expect(200);

            const updatedModule = await fakeRequest(app)
                .get('/modules/single/8')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(updatedModule.body).toEqual(expectation);
        });

        test('deletes one module from the database corresponding to the id in path', async () => {

            const data = await fakeRequest(app)
                .delete('/modules/single/7')
                .expect('Content-Type', /json/)
                .expect(200);


            const deletedModule = await fakeRequest(app)
                .get('/modules/single/7')
                .expect('Content-type', /json/)
                .expect(200);



            expect(deletedModule.body).toEqual([]);
        });

        test('returns modules that are within the category given', async () => {

            const expectation =
            [
                {
                    "id": 1,
                    "_id": "chord",
                    "brand": "Qu-Bit",
                    "module_name": "Chord V2",
                    "image": "chord.jpg",
                    "category_id": 1,
                    "size": 14,
                    "description": "Chord v2 is a long-awaited update to the Qu-Bit’s original polyphonic oscillator. While gaining a tremendous reduction in HP size, the module kept all the beloved functionality of its predecessor and even attained a few new tricks up its sleeve.",
                    "price": 299,
                    "in_stock": true,
                    "owner_id": 1,
                    "category_name": "oscillator"
                },
                {
                    "id": 8,
                    "_id": "Beads",
                    "brand": "Mutable Instruments",
                    "module_name": "Beads",
                    "image": "https://www.perfectcircuit.com/media/catalog/product/cache/31f4f069f336eca018319f55f291a10e/M/u/MutableInstruments_Beads_01.jpg",
                    "category_id": 1,
                    "size": 19,
                    "description": "The Clouds clear, and a new day is upon us: Mutable Instruments is back with the successor to their highly sought-after Clouds texture synthesizer, Beads. Beads's theoretical approach remains the same—it is a real-time granular processor, but the improvements over the original module are vast. Higher audio quality, improved interpolation and anti-aliasing, longer buffer, and a faster DSP sampling rate make this a worthy successor.",
                    "price": 400,
                    "in_stock": true,
                    "category_name": "oscillator",
                    "owner_id": 1
                }
            ]

            const data = await fakeRequest(app)
                .get('/category/oscillator')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(data.body).toEqual(expectation);
        });

    });
});
