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
        [ResponseType(typeof(User))]
        [AllowAnonymous]
        public async Task<IHttpActionResult> GetUser(int id)
        {
            User user = await db.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // PUT: api/Users/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutUser(int id, User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != user.Id)
            {
                return BadRequest();
            }

            db.Entry(user).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
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

            var v = db.User.Where(a => a.Username.Equals(user.Username) || a.Email.Equals(user.Email)).FirstOrDefault();

            if (v == null)
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

        private bool UserExists(int id)
        {
            return db.User.Count(e => e.Id == id) > 0;
        }


    }
}