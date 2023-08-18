const express = require('express');
const app = express();
const port = 3002;

const stripe = require('stripe')('sk_test_51NeQwoKpvocBQvBr4wFApOA12NKgXetQVaxeZ8XalZfr5u8myErNgHk0HSDOj0nU8I0OsGZcCFKX01sunLu8JtDl00w6DznL9O');
// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

const bodyParser = require('body-parser');
app.use(bodyParser.json());


app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const { amount } = req.body;
  console.log(amount)
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2022-11-15'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount || 0,
    currency: 'aud',
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: 'pk_test_51NeQwoKpvocBQvBrIxPsnTPlWbYofwz6tLSBQzvoL9NlbyIQXzfook55fhk4N7LrnrQJpDIMUO5C4KUc3B7v4Jsd00DyWTr9xf'
  });
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    
  });