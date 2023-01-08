import React, {Component} from 'react';
import './App.css';
import Navigation from './components/navigation/navigation';
import Logo from './components/logo/logo';
import ImageLinkForm from './components/ImageLinkForm/imagelinkform';
import FaceRecognition from './components/facerecognition/facerecognition';
import Rank from './components/Rank/rank';
import ParticlesBg from 'particles-bg'
import Signin from './components/Signin/Signin';
import Register from './components/Register/register';

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    email: '',
    name: '',
    entries: '',
    joined: ''
  }}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      email: data.email,
      name: data.name,
      entries: data.entries,
      joined: data.joined
  }})
  }

  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //         .then(response => response.json())

  //         // these two do the same thing, so we optimize 
  //         // .then(data => console.log(data))
  //         .then(console.log)
  // }

  onRouteChange = (route) => {
        if (route === 'signin') {
          this.setState(initialState)
        } else if (route === 'home') {
          this.setState({isSignedIn: true})
        }
    this.setState({route: route});
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return  {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }
  

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
              fetch('https://facerecognition-api-fzim.onrender.com/imageurl', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  input: this.state.input
              })
            })
              .then(response => response.json())
              .then(response => {
                if (response) {
                  fetch('https://facerecognition-api-fzim.onrender.com/image', {
                    method: 'put',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                      id: this.state.user.id
                    })
                  })
                    .then(response => response.json())
                    .then(count => {
                      this.setState(Object.assign(this.state.user, { entries: count }))
                    })
                    .catch(console.log)
              }
            this.displayFaceBox(this.calculateFaceLocation(response))
          })
          .catch(err => console.log('woops'));
    }
    

  // const raw = JSON.stringify({
  //   "user_app_id": {
  //     "user_id": "aqtpwt25qqga",
  //     "app_id": "7e8ceccac1124a85aa77dc54ff12b349"
  //   },
  //   "inputs": [
  //     {
  //       "data": {
  //         "image": {
  //           "url": "https://samples.clarifai.com/metro-north.jpg"
  //         }
  //       }
  //     }
  //   ]
  // });
  
  // const requestOptions = {
  //   method: 'POST',
  //   headers: {
  //     'Accept': 'application/json',
  //     'Authorization': 'Key acdcaf9db49947e7b4f26850ff286c25'
  //   },
  //   body: raw
  // };
  
  // fetch("https://api.clarifai.com/v2/models/{a403429f2ddf4b49b307e318f00e528b}/versions/{2.9.1}/outputs", requestOptions)
  //   .then(response => response.text())
  //   .then(result => console.log(JSON.parse(result, null, 2).outputs[0].data))
  //   .catch(error => console.log('error', error));

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="circle" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }

//   render() { 
//     return (
//     <div className="App">
//       <ParticlesBg type="circle" bg={true} />
//       <Navigation 
//           onRouteChange={this.onRouteChange}
//           isSignedIn={this.state.isSignedIn}/>
//       { this.state.route === 'home' 
//         ? 
//           <div>
//               <Logo />
//               <Rank 
//                   name={this.state.user.name}
//                   entries={this.state.user.entries}
//               />
//               <ImageLinkForm 
//                   onInputChange={this.onInputChange} 
//                   onButtonSubmit={this.onButtonSubmit}
//               />
//               <FaceRecognition
//                   box={this.state.box} imageUrl={this.state.imageUrl}
//               />
//           </div>
//         : (
//           this.state.route === 'signin' 
//           ?
//           <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
//           : 
//           <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
//           )
//         }
//     </div>
//   );
// }
}

export default App;
