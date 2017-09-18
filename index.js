var express = require("express");
var app = express();
var bodyParser = require('body-parser');

import { httpGet } from './libs/functions';

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// api
app.get('/githubPayload/:uid', (req, res)=>{
  let auth = ""

  let url_user        = "https://api.github.com/users/baybird"+auth
  let url_user_repos  = "https://api.github.com/users/baybird/repos"+auth
  let url_commit      = "https://api.github.com/repos/baybird/%s/commits"+auth
  let url_pull        = "https://api.github.com/repos/baybird/%s/pulls"+auth
  var output          = {};


  httpGet(url_user).then((response)=>{ // basic info
    let user  = JSON.parse(response);

    output['user'] = {}
    output['user']['githubHandle']  = user.login;
    output['user']['githubURL']     = user.url;
    output['user']['avatarURL']     = user.avatar_url;
    output['user']['email']         = user.email;
    output['user']['followerCount'] = user.followers;
    return httpGet(url_user_repos);
  }).then((response)=>{ // repos
    let repos = JSON.parse(response);
    output['user']['repositories'] = []

    async function call(){
      var i=0;
      for(var repo of repos){
        i++;
        var url = url_commit.replace("%s", repo.name);
        var ret = await httpGet(url);
        var commits = JSON.parse(ret);
        // console.log(url)

        var url = url_pull.replace("%s", repo.name);
        var ret = await httpGet(url);
        var pulls = JSON.parse(ret);
        // console.log(url)

        var obj = {}
        obj['name']             = repo.name
        obj['url']              = repo.git_url
        obj['commitCount']      = typeof commits === undefined? null:commits.length;
        obj['pullRequestCount'] = typeof pulls === undefined? null:pulls.length;

        output['user']['repositories'].push(obj);

      }

      return output;
    }

    call().then(resposne=>{
      res.send(resposne)
    }).catch(err=>{
      res.send(err)
      console.log(err)
    });


  }).catch((error)=>{
    res.send(error)
  })
});

app.get('/githubPayload', (req, res)=>{
  let auth = "?client_id=d44c5b8dcac9dcedec0c&client_secret=6a0753c27dac93863a0037a2ab9c457250d96096"

  let url_user        = "https://api.github.com/users/baybird"+auth
  let url_user_repos  = "https://api.github.com/users/baybird/repos"+auth
  let url_commit      = "https://api.github.com/repos/baybird/%s/commits"+auth
  let url_pull        = "https://api.github.com/repos/baybird/%s/pulls"+auth
  var output          = {};


  httpGet(url_user).then((response)=>{ // basic info
    let user  = JSON.parse(response);

    output['user'] = {}
    output['user']['githubHandle']  = user.login;
    output['user']['githubURL']     = user.url;
    output['user']['avatarURL']     = user.avatar_url;
    output['user']['email']         = user.email;
    output['user']['followerCount'] = user.followers;
    return httpGet(url_user_repos);
  }).then((response)=>{ // repos
    let repos = JSON.parse(response);
    output['user']['repositories'] = []

    async function call(){
      var i=0;
      for(var repo of repos){
        i++;
        var url = url_commit.replace("%s", repo.name);
        var ret = await httpGet(url);
        var commits = JSON.parse(ret);
        // console.log(url)

        var url = url_pull.replace("%s", repo.name);
        var ret = await httpGet(url);
        var pulls = JSON.parse(ret);
        // console.log(url)

        var obj = {}
        obj['name']             = repo.name
        obj['url']              = repo.git_url
        obj['commitCount']      = typeof commits === undefined? null:commits.length;
        obj['pullRequestCount'] = typeof pulls === undefined? null:pulls.length;

        output['user']['repositories'].push(obj);

      }

      return output;
    }

    call().then(resposne=>{
      res.send(resposne)
    }).catch(err=>{
      res.send(err)
      console.log(err)
    });


  }).catch((error)=>{
    res.send(error)
  })
});

app.listen('3001', () => {
  console.log(`Find the server at: http://localhost:3001/`);
});
