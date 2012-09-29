require 'albacore'
task :default => [:git_commit_and_push]

desc "Build Solution"
msbuild :build do |msb|
	msb.properties :configuration => :Debug
	msb.targets :Build
	msb.solution = "sllabres.sln"
end

desc "Run unit tests"
nunit :test => :build do |nunit|
	nunit.command = "../Library/NUnit/bin/nunit-console.exe"
	nunit.assemblies "./sllabres.web.test/sllabres.web.test.csproj"
	nunit.options '/xml=Sllabres.Tests-Results.xml'
end

task :git_commit_and_push => :test do	
	`git add .`
	`git commit -m "Automated Commit"`
	`git push origin master`
end