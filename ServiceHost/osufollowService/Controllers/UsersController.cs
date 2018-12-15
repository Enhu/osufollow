using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using osufollowService.Data;
using osufollowService.Filters;
using osufollowUser.Models;
using osufollowService.Helpers;
using Newtonsoft.Json;

namespace osufollowService.Controllers
{
    public class UsersController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Users
        [AllowAnonymous]
        public IQueryable<User> GetUser()
        {
            return db.User;
        }

    // GET: api/Users/5
        [JwtAuthentication]
        [ResponseType(typeof(User))]
        public IHttpActionResult GetUser(string username)
        {
            User user = db.User.Where(a => a.Username.Equals(username)).FirstOrDefault();

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

    // PUT: api/Users/5
    [JwtAuthentication]
    [Route("api/users/update", Name = "UpdateUser")]
    [ResponseType(typeof(void))]
    public IHttpActionResult PutUser(string username, User user)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var dbUser = db.User.SingleOrDefault(a => a.Username == username);

      if (dbUser != null)
      {
        if(dbUser.Password != user.Password)
        {
          dbUser.Password = PasswordHashing.HashPassword(user.Password);
        }
        if(dbUser.OsuId != user.OsuId)
        {
          dbUser.OsuId = user.OsuId;
        }
        if(dbUser.Email != user.Email)
        {
          dbUser.Email = user.Email;
        }
        if(dbUser.Avatar != user.Avatar)
        {
          dbUser.Avatar = user.Avatar;
        }
        db.SaveChanges();

        return StatusCode(HttpStatusCode.NoContent);
      }


      return NotFound(); 
    }

    // POST: api/Users
    //registers the user
    [AllowAnonymous]
        [ResponseType(typeof(User))]
        [Route("api/users/register", Name = "RegisterUser")]
        public async Task<IHttpActionResult> PostUser(User user)
        {
            string json;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var dbUser = db.User.Where(a => a.Username.Equals(user.Username) || a.Email.Equals(user.Email)).FirstOrDefault();

            if (dbUser == null)
            {
                user.Password = PasswordHashing.HashPassword(user.Password);

                db.User.Add(user);
                await db.SaveChangesAsync();
                json = JsonConvert.SerializeObject(new { userExists = true });
                return Ok(json);
            }
            json = JsonConvert.SerializeObject(new { userExists = false });
            return Ok(json);
        }

        // DELETE: api/Users/5
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> DeleteUser(int id)
        {
            User user = await db.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            db.User.Remove(user);
            await db.SaveChangesAsync();

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(string username)
        {
            var dbUser = db.User.Where(a => a.Username.Equals(username)).FirstOrDefault();

            if (dbUser == null)
            {
                return false;
            }

        return true;
    }


    }
}
