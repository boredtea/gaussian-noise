import os
from dotenv import load_dotenv
from flask import Flask, render_template, request, abort
import flask
import json
from flask.helpers import url_for
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant, ChatGrant
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

room_name = 'My Room'

load_dotenv()
twilio_account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
twilio_api_key_sid = os.environ.get('TWILIO_API_KEY_SID')
twilio_api_key_secret = os.environ.get('TWILIO_API_KEY_SECRET')
twilio_client = Client(twilio_api_key_sid, twilio_api_key_secret,
                       twilio_account_sid)

app = Flask(__name__)


def get_chatroom(name):
    for conversation in twilio_client.conversations.conversations.list():
        if conversation.friendly_name == name:
            return conversation
    print(twilio_client.conversations.conversations.list())
    # a conversation with the given name does not exist ==> create a new one
    return twilio_client.conversations.conversations.create(
        friendly_name=name)

# polling stuff
poll_data = {
#    'question' : 'Which web framework do you use?',
   'fields'   : ['Yay', 'Nay']
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/choose')
def choose():
    return render_template('choose.html')

@app.route('/lounge')
def lounge():
    return render_template('lounge.html')

@app.route('/party')
def party():
    return render_template('party.html', data=poll_data)

filename = 'poll.txt'
@app.route('/poll')
def poll():
    vote = request.args.get('field')

    out = open(filename, 'a')
    out.write( vote + '\n' )
    out.close()
    return vote 

# @app.route('/results')
def show_results():
    votes = {}
    for f in poll_data['fields']:
        votes[f] = 0
 
    f  = open(filename, 'r')
    for line in f:
        vote = line.rstrip("\n")
        votes[vote] += 1
 
    return render_template('results.html', data=poll_data, votes=votes)


@app.route('/login', methods=['POST'])
def login():
    global room_name
    username = request.get_json(force=True).get('username')
    if not username:
        abort(401)

    conversation = get_chatroom(room_name)
    try:
        conversation.participants.create(identity=username)
        #conversation.participants.create(identity="Poll Bot")
    except TwilioRestException as exc:
        # do not error if the user is already in the conversation
        if exc.status != 409:
            raise

    token = AccessToken(twilio_account_sid, twilio_api_key_sid,
                        twilio_api_key_secret, identity=username)
    token.add_grant(VideoGrant(room=room_name))
    token.add_grant(ChatGrant(service_sid=conversation.chat_service_sid))

    return {'token': token.to_jwt().decode(),
            'conversation_sid': conversation.sid}


@app.route('/addRoom', methods=['POST'])
def add_room():
    print("data ",request.data)
    global room_name
    room_name = json.loads(request.data)["content"]
    print(room_name)
    #return flask.redirect(url_for('index'))
    #return flask.redirect(url_for('login'))
    return flask.jsonify({'a':'b'})


if __name__ == '__main__':
    # rooms = twilio_client.conversations.conversations.list()

    # for record in rooms:
    #     print(record.friendly_name)
    app.run(host='0.0.0.0')
    
