using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using System.Configuration;
using Coypu;
using Coypu.Drivers;
using ITGuys.Tests.PageObjects;
using Coypu.Drivers.Selenium;
using OpenQA.Selenium.Remote;
using OpenQA.Selenium;
using System.Reflection;

namespace ITGuys.Tests
{
    [TestFixture]
    public class GivenITGuys
    {
        private BrowserSession _browserSession;        
        private SauceLabsDriver _driver;
        private INotifySauceTestResults _sauceResultNotifier;

        public GivenITGuys()
        {            
            var sauceREST = new SauceREST(new SauceConfiguration()
                {
                    Accesskey = "892fdc2f-7409-4979-a592-e5e3d3ee73bc",
                    Username = "sebllabres"
                });

            _sauceResultNotifier = new SauceSeleniumTestResult(sauceREST);
        }

        [SetUp]
        public void SetUp()
        {
            var configuration = new SessionConfiguration { Driver = typeof(SauceLabsDriver) };
            var desiredCapabilites = new DesiredCapabilities("chrome", "46", Platform.CurrentPlatform);
            desiredCapabilites.SetCapability("platform", "Windows 7");
            desiredCapabilites.SetCapability("username", "sebllabres");
            desiredCapabilites.SetCapability("accessKey", "892fdc2f-7409-4979-a592-e5e3d3ee73bc");
            desiredCapabilites.SetCapability("name", TestContext.CurrentContext.Test.Name);
            _driver = new SauceLabsDriver(Browser.Parse(ConfigurationSettings.AppSettings["browser"]), desiredCapabilites, new CustomRemoteDriver(new Uri("http://ondemand.saucelabs.com:80/wd/hub"), desiredCapabilites));
            _browserSession = new BrowserSession(configuration, _driver);
            _browserSession.MaximiseWindow();
        }

        [TearDown]
        public void TearDown()
        {
            var result = TestContext.CurrentContext.Result;            

            var sessionId = _driver.SessionId;            

            _browserSession.Driver.Dispose();
            _browserSession.Dispose();

            if (result.State == TestState.Success)
                _sauceResultNotifier.Pass(sessionId, TestContext.CurrentContext.Test.Name);
            else
                _sauceResultNotifier.Fail(sessionId, TestContext.CurrentContext.Test.Name);
        }

        [Test]
        public void WhenViewingImportantPeopleInITThenDateOfBirthIsCorrect()
        {
            _browserSession.Visit(ConfigurationSettings.AppSettings["AppHost"] + "/ITGuys/v3.htm");
            var iTGuysPage = new ITGuysPage(_browserSession);
            var importantPeopleStore = new ImportantPeopleStore(iTGuysPage.GetImportantPeople());

            Assert.That(iTGuysPage.GetHeading(), Is.EqualTo("Important People in IT"));
            Assert.That(iTGuysPage.GetSubHeading(), Is.EqualTo("Version 3"));
            Assert.That(importantPeopleStore.GetImportantPerson("Tommy", "Flowers").DateOfBirth, Is.EqualTo("22/12/1905"));
            Assert.That(importantPeopleStore.GetImportantPerson("Bob", "Kahn").DateOfBirth, Is.EqualTo("23/12/1938"));
            Assert.That(importantPeopleStore.GetImportantPerson("Larry", "Ellison").DateOfBirth, Is.EqualTo("17/08/1944"));
            Assert.That(importantPeopleStore.GetImportantPerson("Scott", "McNealy").DateOfBirth, Is.EqualTo("13/11/1954"));
            Assert.That(importantPeopleStore.GetImportantPerson("Steve", "Jobs").DateOfBirth, Is.EqualTo("24/02/1955"));
            Assert.That(importantPeopleStore.GetImportantPerson("Tim", "Berners-Lee").DateOfBirth, Is.EqualTo("08/06/1955"));
            Assert.That(importantPeopleStore.GetImportantPerson("Bill", "Gates").DateOfBirth, Is.EqualTo("28/10/1955"));
            
        }
    }    

    public class SauceLabsDriver : SeleniumWebDriver
    {
        public string SessionId { get { return _remoteDriver.SessionId.ToString(); } }
        private CustomRemoteDriver _remoteDriver;

        public SauceLabsDriver(Browser browser, ICapabilities capabilities, CustomRemoteDriver remoteDriver)
            : base(remoteDriver, browser)
        {
            _remoteDriver = remoteDriver;
        }
    }

    public class CustomRemoteDriver : RemoteWebDriver
    {
        public CustomRemoteDriver(Uri remoteHost, DesiredCapabilities capabilities)
            : base(remoteHost, capabilities)
        {
            
        }

        public string SessionId { get { return base.SessionId.ToString(); } }
    }
}
