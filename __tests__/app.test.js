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
          "id": 1,
          "_id": "chord",
          "brand": "Qu-Bit",
          "module_name": "Chord V2",
          "image": "chord.jpg",
          "category": "Oscillator",
          "size": 14,
          "description": "Chord v2 is a long-awaited update to the Qu-Bit’s original polyphonic oscillator. While gaining a tremendous reduction in HP size, the module kept all the beloved functionality of its predecessor and even attained a few new tricks up its sleeve.",
          "price": 299,
          "in_stock": true,
          "owner_id": 1
        },
        {
          "id": 2,
          "_id": "ikarie",
          "brand": "BASTL",
          "module_name": "Ikarie Stereo Filter",
          "image": "ikarie.jpg",
          "category": "Filter",
          "size": 8,
          "description": "The next collaboration between Bastl and Casper Electronics has landed, and the Ikarie Stereo Filter is ready for spacey resonances and interstellar spatial modulation. Rather than offering discrete outputs for lowpass and highpass like most state-variable filter designs, Ikarie will continuously morph between the two, and depending on how it is patched, an array of resonant bandpass or stereo notch filtering will be heard.",
          "price": 259,
          "in_stock": false,
          "owner_id": 1
        },
        {
          "id": 3,
          "_id": "zadar",
          "brand": "XAOC Devices",
          "module_name": "Zadar Quad Envelope",
          "image": "zadar.jpg",
          "category": "Envelope",
          "size": 10,
          "description": "The XAOC Zadar is a widely configurable function generator which redefines the very notion of the modulation envelope. It consists of four independent channels which can be assigned functions made of up to 1000 segments and which can be warped, reversed, and stretched using the simple and intuitive menu system or via each channel’s assignable CV input. Each channel can output functions ranging in time from 0.08 milliseconds to 30 minutes and supports looping and chaining of waveforms, allowing for use as a complex FM source and LFO as well! With all this functionality and more in a mere 10hp, the Zadar is sure to breathe new life into any setup.",
          "price": 330,
          "in_stock": true,
          "owner_id": 1
        },
        {
          "id": 4,
          "_id": "maths",
          "brand": "Make Noise",
          "module_name": "Maths",
          "image": "maths.jpg",
          "category": "Envelope",
          "size": 20,
          "description": "Make Noise Maths is a Control Voltage Generator and Processor indebted to the classic designs of Don Buchla in his Model 257 and Model 281 function generators. The design of Buchla's envelopes allowed them to easily switch between cycling and triggered envelopes, providing LFOs as well, and at high enough speeds, Oscillators. This design was then appropriated for the Serge Dual Universal Slope Generator, which is an apt name as it can basically create any kind of rising and falling voltage. Maths continues in this great tradition of versatile and function-packed modules.",
          "price": 290,
          "in_stock": false,
          "owner_id": 1
        },
        {
          "id": 5,
          "_id": "quad-vca",
          "brand": "Intellijel",
          "module_name": "Quad VCA",
          "image": "quad-vca.jpg",
          "category": "VCA",
          "size": 12,
          "description": "Intellijel’s brand new Quad VCA can be used as a four individual VCAs, or as a four-channel mixer. The module offers users the ability to route each individual channel to a separate destination in their system, or use the Mix out for a sum of all four signals. The module features a continually adjustable linear to exponential response curve, and a Boost switch that adds up to 6dB of gain to each channel. ",
          "price": 189,
          "in_stock": true,
          "owner_id": 1
        },
        {
          "id": 6,
          "_id": "ripples",
          "brand": "Mutable Instruments",
          "module_name": "Ripples V2 Liquid Filter",
          "image": "ripples.jpg",
          "category": "Filter",
          "size": 8,
          "description": "Ripples from Mutable Instruments is an analog multi-mode filter that sounds huge and features two cutoff slopes. Ripples offers two inputs, one transparent and clean, and one with a drive control that can saturate and distort incoming signals. It even adds enough gain to bring line-level signals into your modular. Ripples includes a high pass, low pass, and band pass filter outputs. The band pass and low pass outputs are switchable between two and four-pole operation, giving two flavors of cutoff slope. The resonance setting sets the slope of the high pass filter.",
          "price": 199,
          "in_stock": false,
          "owner_id": 1
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
          "category": "Oscillator",
          "size": 14,
          "description": "Chord v2 is a long-awaited update to the Qu-Bit’s original polyphonic oscillator. While gaining a tremendous reduction in HP size, the module kept all the beloved functionality of its predecessor and even attained a few new tricks up its sleeve.",
          "price": 299,
          "in_stock": true,
          "owner_id": 1
        }];

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
            "category": "VCA",
            "size": 12,
            "description": "Intellijel’s brand new Quad VCA can be used as a four individual VCAs, or as a four-channel mixer. The module offers users the ability to route each individual channel to a separate destination in their system, or use the Mix out for a sum of all four signals. The module features a continually adjustable linear to exponential response curve, and a Boost switch that adds up to 6dB of gain to each channel. ",
            "price": 189,
            "in_stock": true,
            "owner_id": 1
          },
          {
            "id": 6,
            "_id": "ripples",
            "brand": "Mutable Instruments",
            "module_name": "Ripples V2 Liquid Filter",
            "image": "ripples.jpg",
            "category": "Filter",
            "size": 8,
            "description": "Ripples from Mutable Instruments is an analog multi-mode filter that sounds huge and features two cutoff slopes. Ripples offers two inputs, one transparent and clean, and one with a drive control that can saturate and distort incoming signals. It even adds enough gain to bring line-level signals into your modular. Ripples includes a high pass, low pass, and band pass filter outputs. The band pass and low pass outputs are switchable between two and four-pole operation, giving two flavors of cutoff slope. The resonance setting sets the slope of the high pass filter.",
            "price": 199,
            "in_stock": false,
            "owner_id": 1
          },
          {
            "id": 2,
            "_id": "ikarie",
            "brand": "BASTL",
            "module_name": "Ikarie Stereo Filter",
            "image": "ikarie.jpg",
            "category": "Filter",
            "size": 8,
            "description": "The next collaboration between Bastl and Casper Electronics has landed, and the Ikarie Stereo Filter is ready for spacey resonances and interstellar spatial modulation. Rather than offering discrete outputs for lowpass and highpass like most state-variable filter designs, Ikarie will continuously morph between the two, and depending on how it is patched, an array of resonant bandpass or stereo notch filtering will be heard.",
            "price": 259,
            "in_stock": false,
            "owner_id": 1
          },
          {
            "id": 4,
            "_id": "maths",
            "brand": "Make Noise",
            "module_name": "Maths",
            "image": "maths.jpg",
            "category": "Envelope",
            "size": 20,
            "description": "Make Noise Maths is a Control Voltage Generator and Processor indebted to the classic designs of Don Buchla in his Model 257 and Model 281 function generators. The design of Buchla's envelopes allowed them to easily switch between cycling and triggered envelopes, providing LFOs as well, and at high enough speeds, Oscillators. This design was then appropriated for the Serge Dual Universal Slope Generator, which is an apt name as it can basically create any kind of rising and falling voltage. Maths continues in this great tradition of versatile and function-packed modules.",
            "price": 290,
            "in_stock": false,
            "owner_id": 1
          },
          {
            "id": 1,
            "_id": "chord",
            "brand": "Qu-Bit",
            "module_name": "Chord V2",
            "image": "chord.jpg",
            "category": "Oscillator",
            "size": 14,
            "description": "Chord v2 is a long-awaited update to the Qu-Bit’s original polyphonic oscillator. While gaining a tremendous reduction in HP size, the module kept all the beloved functionality of its predecessor and even attained a few new tricks up its sleeve.",
            "price": 299,
            "in_stock": true,
            "owner_id": 1
          },
          {
            "id": 3,
            "_id": "zadar",
            "brand": "XAOC Devices",
            "module_name": "Zadar Quad Envelope",
            "image": "zadar.jpg",
            "category": "Envelope",
            "size": 10,
            "description": "The XAOC Zadar is a widely configurable function generator which redefines the very notion of the modulation envelope. It consists of four independent channels which can be assigned functions made of up to 1000 segments and which can be warped, reversed, and stretched using the simple and intuitive menu system or via each channel’s assignable CV input. Each channel can output functions ranging in time from 0.08 milliseconds to 30 minutes and supports looping and chaining of waveforms, allowing for use as a complex FM source and LFO as well! With all this functionality and more in a mere 10hp, the Zadar is sure to breathe new life into any setup.",
            "price": 330,
            "in_stock": true,
            "owner_id": 1
          }
        ]

      const data = await fakeRequest(app)
        .get('/sorted')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

  });
});
