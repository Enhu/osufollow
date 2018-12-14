using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BCr = BCrypt.Net;

namespace osufollowService.Helpers
{
    public class PasswordHashing
    {
        private static string GetRandomSalt()
        {
            return BCr.BCrypt.GenerateSalt(12);
        }

        public static string HashPassword(string password)
        {
            return BCr.BCrypt.HashPassword(password, GetRandomSalt());
        }

        public static bool ValidatePassword(string password, string correctHash)
        {
            return BCr.BCrypt.Verify(password, correctHash);
        }
    }
}