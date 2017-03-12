import React from 'react'
import Router from 'react-router'
import Repos from './Github/Repos'
import UserProfile from './Github/UserProfile'
import Notes from './Notes/Notes'
import getGithubInfo from '../utils/helpers'
import Rebase from 're-base';

const base = Rebase.createClass({databaseURL: 'https://github-note-taker-ef11e.firebaseio.com/'})

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [1, 2, 3],
      bio: {},
      repos: []      
    }
  }
  componentDidMount() {
    this.init(this.props.params.username);
  }
  componentWillUnMount() {
    base.removeBinding(this.ref);
  }
  componentWillReceiveProps(nextProps) {
    base.removeBinding(this.ref);
    this.init(nextProps.params.username);
  }
  handleAddNote(newNote) {
    debugger;
    base.post(this.props.params.username, {
      data: this.state.notes.concat([newNote])
    })
  }
  init(username) {
    this.ref = base.bindToState(username, {
      context: this,
      asArray: true,
      state: 'notes'
    });
    getGithubInfo(username)
      .then(function(data) {
        this.setState({
          bio: data.bio,
          repos: data.repos
        })
      }.bind(this))
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-4">
          <UserProfile username={this.props.params.username} bio={this.state.bio} />
        </div>
        <div className="col-md-4">
          <Repos username={this.props.params.username} repos={this.state.repos}/>
        </div>
        <div className="col-md-4">
          <Notes
            username={this.props.params.username}
            notes={this.state.notes}
            addNote={(newNote) => this.handleAddNote(newNote)} />
        </div>
      </div>
    )
  }  
}

export default Profile;
