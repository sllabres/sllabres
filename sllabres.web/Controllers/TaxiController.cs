using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace sllabres.web.Controllers
{
    public class TaxiController : Controller
    {
        public TaxiController()
        {
        }

        public ActionResult Index()
        {            
            return View();
        }
    }
}
