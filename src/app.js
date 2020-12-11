
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser');
const { localsName } = require('ejs');
const dateTime = require('node-datetime');
const nodemailer = require("nodemailer");
var var_arr=['Extracting finished. Refresh the browser to see your Google events'];





 
const sgMail = require('@sendgrid/mail');
const { json } = require('express');

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) =>{
  res.render('index.html');
})

app.post('/', (req, res) => {
  const tkn=req.body.token;
  const fs = require('fs');
  const readline = require('readline');
  const {google} = require('googleapis');

  const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  const TOKEN_PATH = 'token.json';

  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), listEvents);
  });

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
 
    oAuth2Client.getToken(tkn, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  }

  /**
   * Lists the next events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  function listEvents(auth) {
    async function fun(){
    const calendar = await google.calendar({version: 'v3', auth});
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 30,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
      if (events.length) {
        console.log('Your upcoming events:', events);
        events.map((event, i) => {
          var_arr.push(event);
        });
      } else {
        console.log('No upcoming events found.');
      }
    });
  }
  fun()
  }
  res.send(var_arr)
  res.render('index.html')
});


app.post('/events', (req, res) =>{
  // Require google from googleapis package.
  const { google } = require('googleapis')
  // Require oAuth2 from our google instance.
  const { OAuth2 } = google.auth

  // Create a new instance of oAuth and set our Client ID & Client Secret.
  const oAuth2Client = new OAuth2(('365434647961-r0k6ptd4qsrr6018rcemtg401nvv1mcs.apps.googleusercontent.com'), ('6Lshuscc_ojaXDAUMb5HY0SP'))

  // Call the setCredentials method on our oAuth2Client instance and set our refresh token.
  oAuth2Client.setCredentials({
    refresh_token: ('1//04X0zOAZIGDITCgYIARAAGAQSNwF-L9IrS0dit2uq_bFbFZhH0gw9IaAEUuaJq-3vgBZqmPa4cdzrhvM8-m4zrLC674xputjvcT8'),
  })

  // Create a new calender instance.
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

  // Create a new event start date instance for temp uses in our calendar.


  // Create a new event end date instance for temp uses in our calendar.

  
  const segundos = ":02.070Z";

  const inicioDeEvento = `${req.body.eventStartTime}`+segundos;


  const minutos = ":59.070Z";

  
//const finDeEvento2 = `${req.body.eventStartTime}`+minutos;

  
  
  const finDeEvento2 = new Date(`${req.body.eventStartTime}`+minutos);
 
  
  finDeEvento2.setMinutes(finDeEvento2.getMinutes() + 20  )
 


 //  const eventEndTime = new Date()
 // eventEndTime.setMinutes(horaReserva(finDeEvento).getMinutes() + 59)

  // Create a dummy event for temp uses in our calendar
  const event = {
    summary: `${req.body.summary}`,
    description: `${req.body.description}`,
    colorId: 6,
    start: {
      dateTime: inicioDeEvento,
    },
    end: {
      dateTime: finDeEvento2,
    },
 }


  // Check if we a busy and have an event on our calendar for the same time.
  calendar.freebusy.query(
    {
      resource: {
        timeMin: inicioDeEvento,
        timeMax:finDeEvento2,
        items: [{ id: 'primary' }],
      },
    },
    (err, res) => {
      // Check for errors in our query and log them if they exist.
      if (err) return console.error('Free Busy Query Error: ', err)

      // Create an array of all events on our calendar during that time.
      const eventArr = res.data.calendars.primary.busy

      // Check if event array is empty which means we are not busy
      if (eventArr.length === 0) {
        // If we are not busy create a new calendar event.
        return calendar.events.insert(
          { calendarId: 'primary', resource: event },
          err => {
            // Check for errors and log them if they exist.
            if (err) return console.error('Error Creating Calender Event:', err)
            // Else log that the event was created.
            return enviarmail()
          })
        }
      // If event array is not empty log that we are busy.

        return nohaylugar()


    }
  )
  console.log(req.body)
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs

  async function enviarmail ()  { 
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey('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')
  const msg = {
    to: req.body.to, // Change to your recipient
    from: 'mariandev520@gmail.com', // Change to your verified sender
    subject: req.body.summary,
    text: req.body.description,
    html:"Hora de Reserva :  "+ req.body.eventStartTime+" Sintomas del paciente : "+req.body.description,
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })

  res.render('events.html')
   }
})



 function nohaylugar(){


  let alert = require('alert');  
  alert("Horario No Disponible")
 
 }
  

 
 


 const PORT = process.env.PORT || 3000;

 app.listen(PORT, () => {
   console.log(`Servidor a la escucha en el puerto ${PORT}`);
 });