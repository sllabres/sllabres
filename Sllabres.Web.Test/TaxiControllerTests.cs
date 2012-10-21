using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;
using sllabres.web.Controllers;

namespace sllabres.web.test
{
    [TestFixture]
    public class TaxiControllerTests
    {
        [Test]
        public void Action_Result_Is_Retured_For_Index()
        {
            var taxiController = new TaxiController();
            var view = taxiController.Index();
            Assert.That(view, Is.Not.Null);
        }
    }
}