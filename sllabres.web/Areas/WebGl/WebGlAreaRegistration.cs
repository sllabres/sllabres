using System.Web.Mvc;

namespace Sllabres.Web.Areas.WebGl
{
    public class WebGlAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "WebGl";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "WebGl_default",
                "WebGl/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}