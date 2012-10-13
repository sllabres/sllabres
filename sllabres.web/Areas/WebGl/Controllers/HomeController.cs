using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace sllabres.web.Areas.WebGl.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GameOfLife() 
        {
        	return View();
        }

        public ActionResult GameOfLifeThree() 
        {
            return View();
        }
    }
}