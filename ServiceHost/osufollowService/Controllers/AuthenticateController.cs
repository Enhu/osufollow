using osufollowService.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using osufollowService.Helpers;
using osufollowService.Models;

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
               var dbUser = db.User.Where(a => a.Username.Equals(username)).FirstOrDefault();
               var follows = new List<Follow>();

               follows = db.Follow.Where(x => x.Username == username).ToList();
               return Request.CreateResponse(HttpStatusCode.OK, new Response(JwtManager.GenerateToken(username), dbUser.Username, dbUser.Email, dbUser.OsuId, dbUser.Avatar, dbUser.Password, follows), Configuration.Formatters.JsonFormatter);

            }

            return Request.CreateResponse(HttpStatusCode.Unauthorized, "Invalid User", Configuration.Formatters.JsonFormatter);
        }

        public bool CheckUser(string userName, string password)
        {
            var dbUser = db.User.Where(a => a.Username.Equals(userName)).FirstOrDefault();

            if (dbUser != null)
            {
                if (PasswordHashing.ValidatePassword(password, dbUser.Password))
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
        public List<Follow> Follows { get; set; }

      public Response(string token, string user, string email, string osuId, string avatar, string password, List<Follow> follows)
        {
            this.Token = token;
            this.User = user;
            this.Email = email;
            this.OsuId = osuId;
            this.Avatar = avatar;
            this.Password = password;
            this.Follows = follows;
        }

  }
}

