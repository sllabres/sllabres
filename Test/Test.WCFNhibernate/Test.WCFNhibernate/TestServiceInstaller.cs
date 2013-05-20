using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Castle.Windsor;
using Castle.Windsor.Configuration;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Facilities.NHibernate;
using Castle.Transactions;
using FluentNHibernate.Cfg;
using NHibernate;
using Castle.Facilities.AutoTx;


namespace Test.WCFNhibernate
{
    public class TestServiceInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.AddFacility<AutoTxFacility>();
            container.Register(Component.For<INHibernateInstaller>().ImplementedBy<NHibernateInstaller>());
            container.AddFacility<NHibernateFacility>();
        }
    }

    public class NHibernateInstaller : INHibernateInstaller
    {
        public Maybe<IInterceptor> Interceptor { get; set; }

        public string SessionFactoryKey { get; set; }

        public bool IsDefault { get; set; }

        public void Registered(ISessionFactory factory)
        {
        }

        public FluentConfiguration BuildFluent()
        {
            return null;
        }
    }
}