namespace osufollowService.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AvatarIsRequired : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Users", "Avatar", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Users", "Avatar", c => c.String());
        }
    }
}
