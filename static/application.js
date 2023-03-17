const Profile = Vue.component('profile', {
    template: `
    <div>
	
	<div class="profile">
		<div class="row" style="padding-bottom: 40px;">
		<div class="col-sm" style="margin: 40px;">
		    <img class ="dp_big" v-bind:src="'/static/photos/'+this.img_url" alt="john wick">
		</div>
		<div class="col-sm">
		  
		  <h1 style="text-align:left; color: #c1bcff; padding: 140px 0px 0px 0px;"><b>{{ this.name }}</b></h1>
		  <br>
		  <a href="/follow" ><p><b>followers</b></p></a>
		  
		  <p><b>{{ this.followers }}</b></p>
		</div>
		
		<div class="col-sm" style="padding-top: 255px;">
			<a href="/follow"><p><b>following</b></p></a> 
			<p><b>{{ this.following }}</b></p>
			
		</div>
		  
	  </div>
	
	</div>
	
	
	<div class="container-flex" id="myposts">
	<div v-for="post in posts">
	  <div class="row">
		<div class="col">
		  <a href="/editpost" v-on:click="setid(post[0][1])">
		  <img class ="profphotos" v-bind:src="'/static/photos/'+post[0][5]" v-bind:alt="post[0][3]">
		  </a>
		</div>
		<div class="col">
		  <a href="/editpost" v-on:click="setid(post[1][1])">
		  <img class ="profphotos" v-bind:src="'/static/photos/'+post[1][5]" v-bind:alt="post[1][3]">
		  </a>
		</div>
		<div class="col">
		  <a href="/editpost" v-on:click="setid(post[2][1])">
		  <img class ="profphotos" v-bind:src="'/static/photos/'+post[2][5]" v-bind:alt="post[2][3]">
		  </a>
		</div>
	  </div>
	 </div>
	  

	
	  
	  
	</div>
	
    </div>`
    ,
    data: function() {
        return {
        id:JSON.parse(localStorage.getItem('data'))[0],
        name:JSON.parse(localStorage.getItem('data'))[1],
        img_url:null,
		followers:0,
		following:0,
		posts:[] 																																																																																																																																																																																						

       }
}
,
	methods: {
        setid: function(id) {

        	localStorage.setItem('id',id);
        }
}
,

mounted: async function() {
	try{
		var myHeaders = new Headers()
		myHeaders.append("Authorization", "Bearer "+localStorage.getItem("Token"))
		var requestOptions = {
		  method: 'GET',
		  headers: myHeaders,
		  redirect: 'follow'
		}
		data=await fetch("http://127.0.0.1:8080/api/user", requestOptions).then(response => response.text())
		
		if (JSON.parse(data).length==4){
		localStorage.setItem("data",data)
		}
		data=JSON.parse(localStorage.getItem("data"))
	}
	catch(err){
		data=JSON.parse(localStorage.getItem("data"))
	}
	
	//this.name=data[1]
	for (var i = 0; i < data[3].length; ++i) {
		if (data[3][i][0]==this.id){		              //should be id later
			this.img_url=data[3][i][2]

		}
	}
	for (var i = 0; i < data[3].length; ++i) {
		if (data[3][i][1]==this.name){		              //should be id later
			f_wers=data[3][i][4]
			f_wing=data[3][i][3]
			console.log(f_wing)
			if (f_wing==''){
				this.following = '0';
			  }
			else{
				this.following = f_wing.split(',').length
			  }
			if (f_wers==''){
				this.followers = '0';
			  }
			else{
				this.followers = f_wers.split(',').length
			  }
				
		}
	}
	myposts=[]
	
	for (var i = 0; i < data[2].length; ++i) {
		if (data[2][i][0]==this.id){
			myposts.push(data[2][i])
		}
	}
	
	len=myposts.length;
	
	rows=Math.floor(len/3)
	rem=len%3
	for (var i = 0; i < rows; ++i) {
		this.posts.push([myposts[i*3],myposts[i*3+1],myposts[i*3+2]])
		}
	if (rem==1){
		this.posts.push([myposts[len-1],['','','','','',''],['','','','','','']])
	}
	if (rem==2){
		this.posts.push([myposts[len-2],myposts[len-1],['','','','','','']])
	}
		
	


//----


	
	const elem = document.getElementById('welcom')
	elem.innerHTML = "<b>"+"WELCOME "+this.name+"</b>"


//----
}


})



//----------------
//----------------



const Home = Vue.component('Home', {
    props: ["title"],
    template: `
    <div>
    <div style="overflow-y:hidden;">
        <div class="container-flex">
        
	  <div class = "container-fluid">
      <div class = "row row-height">
        <div class = "col-md-3 left col">
            <div style="overflow:hidden;"> 
            <a class="btn btn-primary" href="/newpost" role="button"><b>New Post</b></a>
           
            <router-link to="/profile" class="btn btn-primary" role="button"><b>My Posts</b></router-link>
          
            <a class="btn btn-primary" href="/follow" role="button"><b>Following</b></a>
           
            <a class="btn btn-primary" href="/follow" role="button"><b>Followers</b></a>
            
            </div>
            
            <div>
            
            </div>
        </div>
        <div class = "col-md-6 mid col">
        
        <div v-for="post in posts">
        
            <div class = "post">
            	<div class="posttop">
            		 <div class="container-flex">
            		
            		<div v-for="user in users">
					<div v-if="post[0]==user[0]">
		        		<div class="row">
							<div class="col-2">
							
							  <img class ="dp_small" v-bind:src="'/static/photos/'+user[2]" alt="">
							</div>
							<div class="col-10" style="text-align: justify; padding:15px 15px 0px 0px;">
							  <div class='container' style="padding-left: 0px;">
							  <div class="row" style="padding-left: 0px;">
							    <div class="col-10" style="padding-left: 0px;">
							     <b><button class="postbtn" style="padding-left: 0px;" v-on:click="profile(user[0])" >{{ user[1] }}</button></b>
							    </div>
							    <div class="col-1" style="padding-left: 12%;">
								    <button v-on:click="dpost(post[1])" class="download"><img style ="width:30px;" src="static/download.svg" alt="download"></button>
							    </div>
							  </div>
							  </div>

							  {{ post[3] }}
							</div>
							
													  
							 							
						</div>
						
					</div>
					</div>
					
					</div>					
            	</div>
            	
            	<img class ="post_content" v-bind:src="'/static/photos/'+post[5]" alt="">
            </div>
            
            </div>
            
            
            
            
            
            
            
        </div>
        <div class = "col-md-3 right col">
		    	<form autocomplete="off">
					<input type="text" name="q" id="q" placeholder="Search.." onKeyUp="showResults(this.value)"/>
					<div id="result"></div>
				</form>
			
			<div v-for="user in usersz">

        	<div class="container-flex">
        		<button class="postbtn" style="width: 370px;" v-on:click="profile(user[0])">
        		<div class="row row1">
					<div class="col-2">
					  <img class ="dp_small" v-bind:src="'/static/photos/'+user[2]" alt="">
					</div>
					
					<div class="col-9" style="padding-left: 60px; margin-top: 36px;">
					  <b>{{user[1]}}</b>
					  <br>
					</div>
				</div>
				</button>
			</div>	
			
			</div>


			</div>
      </div>
    </div>
	    
	    </div>
	        

	    </div>
    </div>
        `,
    data: function() {
        return {
            posts: null,
            users: null,
            name: null,
			id: null,
			usersz: null,
            savedIconClass: "text-success", // text-danger text-warning
          
        }
    },
    methods: {
        profile: function(id) {
            localStorage.setItem('id',id);
            if (id==JSON.parse(localStorage.getItem('data'))[0]){
            	window.location.href = "/application#/profile"; 
			}
			else{
				window.location.href = "/profile"; 
			}

        },
		dpost: async function(pid){
			//confirm('are u sure u wann downlaod?');
			var myHeaders = new Headers();
				myHeaders.append("Authorization", "Bearer "+localStorage.getItem('Token'));

				var formdata = new FormData();

				var requestOptions = {
				  method: 'POST',
				  headers: myHeaders,
				  body: formdata,
				  redirect: 'follow'
				};	

				fetch("http://127.0.0.1:8080/api/test?pid="+pid+"&uid="+this.id, requestOptions)
				  .then(response => response.text())
				  .then(result => console.log(result))
				  .catch(error => console.log('error', error));
				
				console.log('api send to initiate download')
				this.tempAlert('Download starts');
				await this.getA();

				this.tempAlert('Downloading...');
				window.location.href = '/download/'+this.id+pid+'.zip'

		},
		getA : () =>{
			return new Promise(resolve => setTimeout(resolve, 1000));
			},

		tempAlert : function(msg,duration=400000){
			var el = document.createElement("div");
			el.setAttribute("style","position:absolute;top: 87%; left: 40%;	color: white; background-color: #0c151c; padding: 10px; padding-right: 10px; padding-left: 10px; border-radius: 20px; padding-left: 70px; padding-right: 70px;font-weight: bold;");
			el.innerHTML = msg;

			var fadeEffect = setInterval(function () {
				if (!el.style.opacity) {
					el.style.opacity = 1;
				}
				if (el.style.opacity > 0) {
					el.style.opacity -= 0.1;
				} else {
					clearInterval(fadeEffect);
				}
			}, 200);
			//setTimeout(function(){
			//el.parentNode.removeChild(el);
			//},duration);
			document.body.appendChild(el);
			}
	
    },
    computed: {
        count: function() {
            return this.messages.length;
        }
    },

    mounted: async function() {
    	
    	var myHeaders = new Headers()
		myHeaders.append("Authorization", "Bearer "+localStorage.getItem("Token"))
		var requestOptions = {
		  method: 'GET',
		  headers: myHeaders,
		  redirect: 'follow'
		}
		data=await fetch("http://127.0.0.1:8080/api/user", requestOptions).then(response => response.text())
		
		if (JSON.parse(data).length==4){
		localStorage.setItem("data",data)
		}
		
		data=JSON.parse(localStorage.getItem("data"))
		this.posts=data[2]
		this.users=data[3]
		this.name=data[1]
		this.id=data[0]
		this.usersz=[data[3][0],data[3][1],data[3][2]]
		const elem = document.getElementById('welcom')
		elem.innerHTML = "<b>"+"WELCOME "+this.name+"</b>"

    }
})

const NotFound = { template: '<p>Page not found</p>' }

const routes = [{
    path: '/',
    component: Home,
    props: { title: 'Fatima' }
}, {
    path: '/profile',
    component: Profile
}];

const router = new VueRouter({
  routes // short for `routes: routes`
})


var app = new Vue({
    el: '#app',
    router: router,
    data: {
        grand_total: 0,
        name:"newname"
    },
    methods: {
        add_grand_total: function() {
            console.log("in grand_total");
            this.grand_total = this.grand_total + 1;
        }
    }

})
