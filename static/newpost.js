Vue.component('formpost', {
   
    template: `
    <div>
      <div class="form">
			<h2 style="padding-bottom: 0px; margin-bottom: 0px;"><b>New Post</b></h2>
			
			<form method="POST" enctype="multipart/form-data">
				
				<input class="input" type="text" style="visibility: hidden; margin-bottom: -20px; margin-top: -20px; padding-top: 0px; padding-bottom: 0px;" id="postname2" name="postname" placeholder="title" required/>
				
				<input class="input" type="text" style="margin-top:0px;" id="postname" placeholder="title">
				<textarea class="input" name="caption" id="caption" cols="40" rows="2" placeholder="Caption" required></textarea>
				
				<input type="file" class="input" id="imgfile" style="color: white;" accept="image/*" name="imgfile">
				
			
				<input class="input button" type="submit" v-on:click="save" name="save" value="save"/>
				
				<a href="/application"><input class="input button" type="button" name="delete" value="Cancel"/></a>
			</form>
			
			
		
		
		</div>
    </div>
        `,
    data: function() {
      return {
          title:null,
          discription:null,
          id:JSON.parse(localStorage.getItem("id"))
        }
    },
    methods: {
        del: async function(name) {
        	confirm('Are you sure?');
            var myHeaders = new Headers();
			myHeaders.append("Authorization", "Bearer "+localStorage.getItem('Token'));
			var requestOptions = {method: 'DELETE', headers: myHeaders, redirect: 'follow'};
		
			fetch("http://127.0.0.1:8080/api/user", requestOptions)
				  .then(response => response.text())
				  .then(result => console.log(result))
				  .catch(error => console.log('error', error));
			  
			await this.getA();
			
			window.location.href = "/application";  
        },
        
        save: async function(name) {
			
			var myHeaders = new Headers();
			myHeaders.append("Authorization", "Bearer "+localStorage.getItem('Token'));
						 
			var formdata = new FormData();
			formdata.append("postname", document.getElementById('postname').value);
			formdata.append("caption", document.getElementById('caption').value);
			formdata.append("photo", document.getElementById('imgfile').files[0]);
			
			var requestOptions = {
			  method: 'POST',
			  headers: myHeaders,
			  body: formdata,
			  redirect: 'follow'
			};

			fetch("http://127.0.0.1:8080/api/user", requestOptions)
			  .then(response => response.text())
			  .then(result => console.log(result))
			  .catch(error => console.log('error', error));
			
			
			console.log('fetch over');  
			  
			await this.getA();
			
			window.location.href = "/application";  
        },
        test:
        async function(){
        	console.log('hi');
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

		for (var i = 0; i < data[1].length; ++i) {  
				if (data[1][i][2]==id){
			  this.title=data[1][i][0]
			  this.discription=data[1][i][3]
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
