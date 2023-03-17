Vue.component('editpost', {
   
    template: `
    <div>
      <div class="form">
			<h2><b>Edit list</b></h2>
			
			<form method= "POST">
				
				<input class="input" type="text" name="postname" id="postname" placeholder="List name" v-bind:value='this.title' required/>
				
				<textarea class="input" name="caption" id="caption" cols="40" rows="3" placeholder="caption" required>{{ this.caption }}</textarea>
			</form>
			
				<input type="file" class="input" id="imgfile" style="color: white;" accept="image/*" name="imgfile">
				
				<button class="input button" v-on:click="save" name="save" value="Save">Save</button>
			
				
				<button class="input button" v-on:click="del" name="delete" value="Delete">Delete</button>
				
				<a href="/application#/profile"><button class="input button" type="button" name="cancel" value="Cancel">Cancel</button></a>
			
				
		
		</div>
    </div>
        `,
    data: function() {
      return {
          title:null,
          caption:null,
          id:JSON.parse(localStorage.getItem("id"))
        }
    },
    methods: {
        del: async function(name) {
        	confirm('Are you sure?');
            var myHeaders = new Headers();
				myHeaders.append("Authorization", "Bearer "+localStorage.getItem('Token'));

				var formdata = new FormData();
				formdata.append("id", this.id);

				var requestOptions = {
				  method: 'DELETE',
				  headers: myHeaders,
				  body: formdata,
				  redirect: 'follow'
				};

				fetch("http://127.0.0.1:8080/api/user", requestOptions)
				  .then(response => response.text())
				  .then(result => console.log(result))
				  .catch(error => console.log('error', error));
			  
			await this.getA();
			
			window.location.href = "/application#/profile"; 
        },
        save: async function(name) {
        	//confirm('Are you sure?');

            var myHeaders = new Headers();
			myHeaders.append("Authorization", "Bearer "+localStorage.getItem('Token'));
			
			var formdata = new FormData();
			    formdata.append("id", this.id);
				formdata.append("postname", document.getElementById('postname').value);
				
				formdata.append("caption", document.getElementById('caption').value);
				if (document.getElementById('imgfile').files[0]){
					formdata.append("photo", document.getElementById('imgfile').files[0]);
				}
			    
			    
			var requestOptions = {method: 'PUT', headers: myHeaders, body: formdata, redirect: 'follow'};

			
			fetch("http://127.0.0.1:8080/api/user", requestOptions);
				  
			  
			await this.getA();
			
			window.location.href = "/application#/profile";  
        },
        getA : () =>{
        return new Promise(resolve => setTimeout(resolve, 500));
    	}
    },
    computed: { 
    
    	
        
    },
    mounted: async function() {
		id=this.id
    	data=JSON.parse(localStorage.getItem("data"))
		
		for (var i = 0; i < data[2].length; ++i) {  
				console.log(data[2][i][1])
				if (data[2][i][1]==this.id){
			  this.title=data[2][i][2]
			  this.caption=data[2][i][3]
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
