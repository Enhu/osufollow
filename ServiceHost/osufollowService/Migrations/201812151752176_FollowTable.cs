namespace osufollowService.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FollowTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Follows",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Username = c.String(nullable: false),
                        OsuFollowedUser = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Follows");
        }
    }
}
