Vue.component('profile', {
   
    template: `
    <div>
		 <div class="profile">
			<div class="row" style="padding-bottom: 40px;">
			<div class="col-sm" style="margin: 40px;">
				<img class ="dp_big" v-bind:src="'/static/photos/'+this.img_url" alt="">
			</div>
			<div class="col-sm">
			  
			  <h1 style="text-align:left; color: #c1bcff; padding: 140px 0px 0px 0px;"><b>{{ this.name }}</b></h1>
			  <br>
			  <a href="#" ><p><b>followers</b></p></a>
			  <p><b>{{ this.followers }}</b></p>
			</div>
			
			<div class="col-sm" style="padding-top: 150px;">
				<input type="button" class="button2" id="follow" value="Follow" v-on:click="follow" style="font-weight: bold;" ></input>
				<a href="#"><p><b>following</b></p></a> 
				<p><b>{{ this.following }}</b></p>
				
			</div>
			  
		  </div>
		
		</div>
		
		
		<div class="container-flex" id="myposts">
		<div v-for="post in posts">
		  <div class="row">
			<div class="col">
			  
			  <img class ="profphotos" v-bind:src="'/static/photos/'+post[0][5]" v-bind:alt="post[0][3]">
			 
			</div>
			<div class="col">
			  
			  <img class ="profphotos" v-bind:src="'/static/photos/'+post[1][5]" v-bind:alt="post[1][3]">
			  
			</div>
			<div class="col">
			  
			  <img class ="profphotos" v-bind:src="'/static/photos/'+post[2][5]" v-bind:alt="post[2][3]">
			  
			</div>
		  </div>
		 </div>
		  
		 
		 </div>
		  
		  
		</div>
    </div>
        `,
    data: function() {
        return {
        id:JSON.parse(localStorage.getItem('id')),
        name:null,
        img_url:null,
		followers:0,
		following:0,
		posts:[] 																																																																																																																																																																																						

       }
}

,
methods: {
        follow: async function() {
        var myHeaders = new Headers();
		myHeaders.append("Authorization", "Bearer "+localStorage.getItem("Token"));

		var formdata = new FormData();

		var requestOptions = {
		  method: 'PUT',
		  headers: myHeaders,
		  body: formdata,
		  redirect: 'follow'
		};
		//api to send follow or unfollow signal
		fetch("http://127.0.0.1:8080/api/test?id="+String(this.id), requestOptions)
		  .then(response => response.text())
		  .then(result => console.log(result))
		  .catch(error => console.log('error', error));
		  
        if (document.getElementById("follow").value=='Follow'){
        	document.getElementById("follow").value="Following";

        }
        else{
        	document.getElementById("follow").value="Follow";
        }

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

		//window.location.href = '/profile'

       } 
},        

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
			this.name=data[3][i][1]

		}
	}
	for (var i = 0; i < data[3].length; ++i) {
		if (data[3][i][0]==this.id){		              //should be id later
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
		this.posts.push([myposts[len-2],[len-1],['','','','','','']])
	}
		
	
//----


		name=JSON.parse(localStorage.getItem('data'))[1]
		const elem = document.getElementById('welcom')
		elem.innerHTML = "<b>"+"WELCOME "+name+"</b>"


//----
	userid=JSON.parse(localStorage.getItem("data"))[0]
	for (var i = 0; i < data[3].length; ++i) {
			if (data[3][i][0]==this.id){		              //should be id later
				followers=data[3][i][4]
				if (followers.includes(String(userid))){
					document.getElementById("follow").value="Following"
				}
				

			}
		}



//------
}


})


var app = new Vue({
    el: '#app'
})
