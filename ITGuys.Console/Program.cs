using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit;
using NUnit.Framework;
using NUnit.Core;
using System.Reflection;
using NUnit.Util;

namespace ITGuys.Console
{
    class Program
    {
        static void Main(string[] args)
        {
            CoreExtensions.Host.InitializeService();
            SimpleTestRunner runner = new SimpleTestRunner();
            TestPackage package = new TestPackage("GivenITGuys");
            string loc = Assembly.GetExecutingAssembly().Location;
            package.Assemblies.Add(loc);
            if (runner.Load(package))
            {
                TestResult result = runner.Run(new NullListener(), TestFilter.Empty, false, LoggingThreshold.Off);

                new XmlResultWriter(@"ITGuysResult.xml").SaveTestResult(result);
            }
        }
    }
}
