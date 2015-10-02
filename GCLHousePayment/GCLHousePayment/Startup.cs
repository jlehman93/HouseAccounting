using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(GCLHousePayment.Startup))]
namespace GCLHousePayment
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
