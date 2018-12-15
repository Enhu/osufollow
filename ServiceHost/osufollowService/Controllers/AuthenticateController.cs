using osufollowService.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using osufollowService.Helpers;

namespace osufollowService.Controllers
{
    public class AuthenticateController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // 
        [AllowAnonymous]
        [HttpPost]
        [Route("api/authenticate/login")]
        public HttpResponseMessage LogIn(string username, string password)
        {
            
            if (CheckUser(username, password))
            {
               var v = db.User.Where(a => a.Username.Equals(username)).FirstOrDefault();
               return Request.CreateResponse(HttpStatusCode.OK, new Response(JwtManager.GenerateToken(username),v.Username,v.Email, v.OsuId, v.Avatar, v.Password), Configuration.Formatters.JsonFormatter);

            }

            return Request.CreateResponse(HttpStatusCode.Unauthorized, "Invalid User", Configuration.Formatters.JsonFormatter);
        }

        public bool CheckUser(string userName, string password)
        {
            var v = db.User.Where(a => a.Username.Equals(userName)).FirstOrDefault();

            if (v != null)
            {
                if (PasswordHashing.ValidatePassword(password, v.Password))
                {
                    return true;
                };
            }

            return false;
            
        }
    }

    public class Response
    {
        public string Token { get; set; }
        public string User { get; set; }
        public string Email { get; set; }
        public string OsuId { get; set; }
        public string Avatar { get; set; }
        public string Password { get; set; }

      public Response(string token, string user, string email, string osuId, string avatar, string password)
        {
            this.Token = token;
            this.User = user;
            this.Email = email;
            this.OsuId = osuId;
            this.Avatar = avatar;
            this.Password = password;
        }
    }
}

