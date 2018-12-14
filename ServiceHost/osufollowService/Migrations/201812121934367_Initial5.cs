namespace osufollowService.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial5 : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Users", "ConfirmEmail");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "ConfirmEmail", c => c.String());
        }
    }
}
