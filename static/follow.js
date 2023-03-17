Vue.component('editpost', {
   
    template: `
    <div>
		<div class="container-fluid">
		  <div class="row" style="padding-top: 20px;">
			<div class="col">
			  <h2><b>Followers</b></h2>
			  
			  
			<div v-for="user in followers">
			
				<div class="container-flex">
		    		<button v-on:click="setid(user[0][0])" style="background-color: transparent; border-color: transparent;" >
		    		<div class="row row1">
						<div class="col-2">
						  <img class ="dp_small" v-bind:src="'/static/photos/'+user[0][2]" alt="">
						</div>
						<div class="col-7" style="padding-left: 60px; margin-top: 36px;">
						  <b>{{ user[0][1] }}</b>
						  <br>					 
						</div>
					</div>
					</button>
				</div>
			
			</div>
			
			
			</div>
			<div class="col">
			  <h2><b>Following</b></h2>
			  
			 <div v-for="user in following">
			
				<div class="container-flex">
		    		<button v-on:click="setid(user[0][0])" style="background-color: transparent; border-color: transparent;" >
		    		<div class="row row1">
						<div class="col-2">
						  <img class ="dp_small" v-bind:src="'/static/photos/'+user[0][2]" alt="">
						</div>
						<div class="col-7" style="padding-left: 60px; margin-top: 36px;">
						  <b>{{ user[0][1] }}</b>
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
        `,
    data: function() {
      return {
          following:[],
          followers:[],
          id:JSON.parse(localStorage.getItem('data'))[0],
        }
    },
    methods: {
        setid: function(id) {

			localStorage.setItem('id',id);
            if (id==JSON.parse(localStorage.getItem('data'))[0]){
            	window.location.href = "/application#/profile"; 
			}
			else{
				window.location.href = "/profile"; 
			}
        }
        
        
    },
    computed: { 
    
    	
        
    },
    mounted: async function() {
		id=this.id
    	data=JSON.parse(localStorage.getItem("data"))
		
		for (var i = 0; i < data[3].length; ++i) {  
				
				if (data[3][i][0]==this.id){
					  f_wing=data[3][i][3]
					  f_wers=data[3][i][4]
			}

		}
		
		for (var i = 0; i < data[3].length; ++i) {  
				
				if (f_wing.includes(data[3][i][0])){
					  this.following.push([data[3][i]])					  
					}
				if (f_wers.includes(data[3][i][0])){
					  this.followers.push([data[3][i]])					  
					}

		}

		
		
		name=JSON.parse(localStorage.getItem('data'))[1]
		const elem = document.getElementById('welcom')
		elem.innerHTML = "<b>"+"WELCOME "+name+"</b>"

    
    }
})


var app = new Vue({
    el: '#app'
})
