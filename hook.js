import frida

appSession = None
appPid = None
device = frida.get_remote_device()

# script just for testing, change to whatever you want
ss = """
Java.perform(function(){
		console.log("Start hooking")
		var s = Java.use("com.example.multipleprocess.newActivity")
		s.testFunc.overload().implementation = function(){
			console.log("testFunc is call")
			return 3
		}
	})
"""

def on_spawned(spawn):
	global appSession, appPid
	print('on_spawned: ', spawn)
  # test package spawn a process name "com.example.multipleprocess:app"
	if "com.example.multipleprocess" in spawn.identifier: 
		appPid = spawn.pid
		appSession = device.attach(appPid)
		print("Attach to {}:{}".format(spawn.identifier, appPid))

# magic happen here
device.on("spawn-added", on_spawned) # there are some others event like child-added, using when your process use fork()
device.enable_spawn_gating() # this will capture all new spawned process in device, but we will attach only to what we want

pid = device.spawn("com.example.multipleprocess")
session = device.attach(pid) # attach main process
device.resume(pid)
input("enter to resume appSession") # input as a wait for :app process appear and attach at on_spawned

script = appSession.create_script(ss)
script.load()
device.resume(appPid)
input("Running")
