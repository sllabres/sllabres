using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Spark;
using Spark.Web.Mvc;
using System.Diagnostics;

namespace Sllabres.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("favicon.ico");

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{id}", 
                new { controller = "Home", action = "Index", id = UrlParameter.Optional }, // Parameter defaults
                new string[] { "Sllabres.Web.Controllers" }
            );
        }

        protected void Application_Start()
        {
            ViewEngines.Engines.Clear();
            AreaRegistration.RegisterAllAreas();
            RegisterRoutes(RouteTable.Routes);

            RegisterViewEngine(ViewEngines.Engines);


            // StructureMapRegistrar.Register();
            // ControllerBuilder.Current.SetControllerFactory(new StructureMapControllerFactory());
        }

        public static void RegisterViewEngine(ViewEngineCollection engines)
        {
            var sparkSettings = new SparkSettings();

            sparkSettings
                .AddNamespace("System")
                .AddNamespace("System.Collections.Generic")
                .AddNamespace("System.Linq")
                .AddNamespace("System.Web.Mvc")
                .AddNamespace("System.Web.Mvc.Html")
                .AddAssembly("Spark.Web.Mvc")
                .AddAssembly("System.Web.Mvc, Version=2.0.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35")
                .AddAssembly("System.Web.Routing, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35");

            /*var builder = new DefaultDescriptorBuilder();
            builder.Filters.Add(new AreaDescriptorFilter());

            var container = SparkEngineStarter.CreateContainer(sparkSettings);
            container.SetServiceBuilder<Spark.Web.Mvc.IDescriptorBuilder>(c => builder);*/
            //SparkEngineStarter.RegisterViewEngine(container);

            engines.Add(new SparkViewFactory(sparkSettings));
        }
    }
}