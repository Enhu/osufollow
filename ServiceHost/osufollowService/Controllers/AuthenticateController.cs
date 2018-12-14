using osufollowService.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

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
                return Request.CreateResponse(HttpStatusCode.OK, JwtManager.GenerateToken(username), Configuration.Formatters.JsonFormatter);

            }

            return Request.CreateResponse(HttpStatusCode.Unauthorized, "Invalid User", Configuration.Formatters.JsonFormatter);
        }

        public bool CheckUser(string userName, string password)
        {
            var v = db.User.Where(a => a.Username.Equals(userName) && a.Password.Equals(password)).FirstOrDefault();

            if (v == null)
            {
                return false;
            }

            return true;
        }
    }
}

