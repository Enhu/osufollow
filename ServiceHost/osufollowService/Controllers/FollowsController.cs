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
using System.Web.Http.Cors;
using System.Web.Http.Description;
using osufollowService.Data;
using osufollowService.Filters;
using osufollowService.Models;

namespace osufollowService.Controllers
{
  [EnableCors(origins: "*", headers: "*", methods: "*")]
  public class FollowsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Follows
        [AllowAnonymous]
        public IQueryable<Follow> GetFollow()
        {
            return db.Follow;
        }

    // GET: api/Follows/5
    // gets followed players of a user
    [ResponseType(typeof(Follow))]
    [AllowAnonymous]
    public IHttpActionResult GetFollow(string username)
    {
      var follows = new List<Follow>();

      follows = db.Follow.Where(x => x.Username == username).ToList();
      if (follows == null)
      {
        return NotFound();
      }

      return Ok(follows);
    }

    // PUT: api/Follows/5
    [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutFollow(int id, Follow follow)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != follow.Id)
            {
                return BadRequest();
            }

            db.Entry(follow).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FollowExists(id))
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

        // POST: api/Follows
        [JwtAuthentication]
        [ResponseType(typeof(Follow))]
        public async Task<IHttpActionResult> PostFollow(Follow follow)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Follow.Add(follow);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = follow.Id }, follow);
        }

    // DELETE: api/Follows/5
    [AllowAnonymous]
    [ResponseType(typeof(Follow))]
    public IHttpActionResult DeleteFollow(string playerName)
    {
      Follow follow = db.Follow.Where(x => x.OsuFollowedUser == playerName).FirstOrDefault();
      if (follow == null)
      {
        return NotFound();
      }

      db.Follow.Remove(follow);
      db.SaveChanges();

      return Ok();
    }

    protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool FollowExists(int id)
        {
            return db.Follow.Count(e => e.Id == id) > 0;
        }
    }
}
