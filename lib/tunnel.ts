import * as net from 'net';
import * as tls from 'tls';
import * as http from 'http';
import * as https from 'https';
import * as events from 'events';
import * as util from 'util';

export interface ProxyOptions {
  host: string;
  port: number;
  localAddress?: string;
  proxyAuth?: string;
}

export interface TunnelingAgentOptions {
  maxSockets?: number;
  proxy?: ProxyOptions;
}

export interface RequestOption {
  host: string;
  port: number;
  localAddress?: string;
}

export class TunnelingAgent extends events.EventEmitter {
  options: TunnelingAgentOptions;
  proxyOptions: ProxyOptions;
  maxSockets: number;
  requests: any[];
  sockets: net.Socket[];

  constructor(options: TunnelingAgentOptions) {
    super();
    this.options = options || {};
    this.proxyOptions = this.options.proxy || {};
    this.maxSockets = this.options.maxSockets || http.globalAgent.maxSockets;
    this.requests = [];
    this.sockets = [];
    this.on('free', function onFree(socket: net.Socket, options: RequestOption) {
      // code here...
    });
  }

  addRequest(req: http.ClientRequest, options: RequestOption): void {
    // code here...
  }

  createSocket(options: RequestOption, callback: (socket: net.Socket) => void): void {
    // code here...
  }

  removeSocket(socket: net.Socket): void {
    // code here...
  }
}

// rest of the code...
// ...Continued from previous

function toOptions(host: string | http.RequestOptions, port?: number, localAddress?: string): http.RequestOptions {
    if (typeof host === 'string') {
      return {
        host: host,
        port: port,
        localAddress: localAddress
      };
    }
    return host;
  }
  
  function mergeOptions(target: any, ...overrides: any[]): any {
    for (let i = 0, len = overrides.length; i < len; ++i) {
      let override = overrides[i];
      if (typeof override === 'object') {
        let keys = Object.keys(override);
        for (let j = 0, keyLen = keys.length; j < keyLen; ++j) {
          let k = keys[j];
          if (override[k] !== undefined) {
            target[k] = override[k];
          }
        }
      }
    }
    return target;
  }
  
  let debug: (...args: any[]) => void;
  if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
    debug = function() {
      let args = Array.prototype.slice.call(arguments);
      if (typeof args[0] === 'string') {
        args[0] = 'TUNNEL: ' + args[0];
      } else {
        args.unshift('TUNNEL:');
      }
      console.error.apply(console, args);
    }
  } else {
    debug = function() {};
  }
  export {debug};
  
  // ...Continued in next
// ...Continued from previous

TunnelingAgent.prototype.createSecureSocket = function(this: TunnelingAgent, options: RequestOptions, cb: (socket: net.Socket) => void) {
    const self = this;
    this.createSocket(options, function(socket: net.Socket) {
      const hostHeader = options.request.getHeader('host');
      const tlsOptions: tls.ConnectionOptions = mergeOptions({}, self.options, {
        socket: socket,
        servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
      });
  
      // 0 is dummy port for v0.6
      const secureSocket = tls.connect(0, tlsOptions);
      self.sockets[self.sockets.indexOf(socket)] = secureSocket;
      cb(secureSocket);
    });
  };
  
  export function httpOverHttp(options: AgentOptions): TunnelingAgent {
    const agent = new TunnelingAgent(options);
    agent.request = http.request;
    return agent;
  }
  
  export function httpsOverHttp(options: AgentOptions): TunnelingAgent {
    const agent = new TunnelingAgent(options);
    agent.request = http.request;
    agent.createSocket = createSecureSocket;
    agent.defaultPort = 443;
    return agent;
  }
  
  export function httpOverHttps(options: AgentOptions): TunnelingAgent {
    const agent = new TunnelingAgent(options);
    agent.request = https.request;
    return agent;
  }
  
  export function httpsOverHttps(options: AgentOptions): TunnelingAgent {
    const agent = new TunnelingAgent(options);
    agent.request = https.request;
    agent.createSocket = createSecureSocket;
    agent.defaultPort = 443;
    return agent;
  }
    