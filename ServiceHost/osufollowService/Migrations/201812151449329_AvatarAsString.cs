namespace osufollowService.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AvatarAsString : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Users", "Avatar", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Users", "Avatar", c => c.Binary());
        }
    }
}
