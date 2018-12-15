using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using osufollowUser.Models;
using osufollowService.Models;

namespace osufollowService.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext() :
          base("osufollowConnectionString")
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

       
       public DbSet<User> User { get; set; }
       public DbSet<Follow> Follow { get; set; }
        
        
    }
}
