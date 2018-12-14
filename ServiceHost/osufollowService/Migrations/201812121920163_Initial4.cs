namespace osufollowService.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial4 : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Users", "Avatar");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "Avatar", c => c.Binary());
        }
    }
}
