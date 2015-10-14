using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Coypu;

namespace ITGuys.Tests.PageObjects
{
    public class ITGuysPage
    {
        private readonly BrowserSession _session;

        public ITGuysPage(BrowserSession session)
        {
            _session = session;
        }

        public string GetHeading()
        {
            return _session.FindCss("h1").InnerHTML;            
        }

        public string GetSubHeading()
        {
            return _session.FindCss("h2").InnerHTML;
        }

        public string GetDateOfBirthBy(string firstname, string surname)
        {
            var rows = _session.FindAllCss("tr").Select(r => 
                {
                    return new ImportantPeopleData
                    {                        
                        Firstname = r.FindAllCss("td").Select(c => c.InnerHTML).ToArray()[0],
                        Surname = r.FindAllCss("td").Select(c => c.InnerHTML).ToArray()[1],
                        DateOfBirth = r.FindAllCss("td").Select(c => c.InnerHTML).ToArray()[2]
                    };                    
                });

            return rows.First(r => r.Firstname == firstname && r.Surname == surname).DateOfBirth;
        }

        internal class ImportantPeopleData
        {
            public string Firstname { get; set; }
            public string Surname { get; set; }
            public string DateOfBirth { get; set; }
        }
    }
}
