using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;

namespace Sllabres.Web.Test
{
    [TestFixture]
    public class HelloWorld
    {
        [Test]
        public void TestHelloWorld()
        {
            Assert.That(true);
        }

        [Test]
        public void FailingTest()
        {
            Assert.That(false);
        }
    }
}
