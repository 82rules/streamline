<?PHP




class server {

	public $handle; 
	public $config; 
	public $ret = '
';

	public function __construct(){
		
		/*
			LOAD CONFIGURATION FILE FOR SETTINGS TO BE SHARED WITH ALL OTHER POSSIBLE LIBRARIES
		*/

		$this->config =  json_decode(file_get_contents(realpath(__DIR__."/../../config.json")),true); 

		$this->handle = new Redis(); 
		$this->handle->connect($this->config['host'],$this->config['port'],$this->config['timeout']);

	}

	public function subscribe($stream){

		header('Content-Encoding', 'chunked');
   		header('Transfer-Encoding', 'chunked');
		header( 'Content-type: '.$this->config['content_type']);
   		header('Connection', 'keep-alive');
		//header( 'Transfer-Encoding: chunked');
		echo str_repeat(" ", 256).$this->ret;

		flush();
		ob_flush();

		$ret = $this->ret;

		try { 	
			$this->handle->subscribe(array($stream), function($redis, $channel, $message) use ($ret){

				echo $message.$ret; 
			    flush();
			    ob_flush();
			    /// force flush of current heap
			    flush();
			    ob_flush();
			}); 
		}
		catch (RedisException $e){ 

			return $e->getMessage().$this->ret;
		}

		return true; 

	}

	public function publish($stream, $content){ 
		return $this->handle->publish($stream,  $content) ? true: false; // send message.
	}

	public function route() { /// basically , if there is data in CRUD, send the message, if just a get, subscribe to path

		$url_parts = parse_url($_SERVER['REQUEST_URI']);
		$channel = $url_parts['path']; 

		$crud = file_get_contents('php://input');
		
		if (empty($crud)) {
			/// READ
			$this->subscribe($channel);
		}
		else {
			//// WRITE
			$data = (empty($crud)) ? http_build_query($_GET) : $crud; 
			return json_encode(array("status"=>$this->publish($channel, $data))); 
		}
	}


}






