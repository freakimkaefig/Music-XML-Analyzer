{{ HTML::script('libs/jquery-1.11.2/jquery-1.11.2.min.js') }}
{{ HTML::script('libs/bootstrap-3.3.2/dist/js/bootstrap.min.js') }}
{{ HTML::script('libs/bootstrap-material-design/dist/js/material.min.js') }}
{{ HTML::script('libs/bootstrap-material-design/dist/js/ripples.min.js') }}

<!-- D3.js -->
{{ HTML::script('libs/d3-v3/d3.min.js') }}
{{ HTML::script('libs/d3-v3/d3pie.min.js') }}
{{ HTML::script('libs/d3-v3/d3tip.js') }}

<!-- Typed.js for log box -->
{{ HTML::script('libs/typed.js/js/typed.js') }}

<!-- Vexflow -->
{{ HTML::script('libs/vexflow/vexflow-debug.js') }}

<!-- Dropzone -->
{{ HTML::script('libs/dropzone-4.0.0/dist/min/dropzone.min.js') }}

 <!-- extras -->
{{ HTML::script('libs/midijs/inc/Base64.js') }}
{{ HTML::script('libs/midijs/inc/base64binary.js') }}
<!-- MIDI.js -->
{{ HTML::script('libs/midijs/js/Color/SpaceW3.js') }}
{{ HTML::script('libs/midijs/js/MIDI/AudioDetect.js') }}
{{ HTML::script('libs/midijs/js/Window/DOMLoader.XMLHttp.js') }}
{{ HTML::script('libs/midijs/js/MIDI/LoadPlugin.js') }}
{{ HTML::script('libs/midijs/js/MIDI/Plugin.js') }}
{{ HTML::script('libs/midijs/js/MIDI/Player.js') }}
{{ HTML::script('libs/midijs/js/MusicTheory/Synesthesia.js') }}
{{ HTML::script('libs/midijs/js/Widgets/Loader.js') }}
{{ HTML::script('libs/midijs/js/Window/Event.js') }}
 <!-- jasmid package -->
{{ HTML::script('libs/midijs/inc/jasmid/stream.js') }}
{{ HTML::script('libs/midijs/inc/jasmid/midifile.js') }}
{{-- {{ HTML::script('libs/inc/jasmid/synth.js') }} --}}
{{-- {{ HTML::script('libs/inc/jasmid/audio.js') }} --}}
{{ HTML::script('libs/midijs/inc/jasmid/replayer.js') }}

<!-- jsPdf -->
{{ HTML::script('libs/jsPDF-0.9.0rc2/dist/jspdf.min.js') }}


 <!-- others -->
{{ HTML::script('js/helpers/Route.js') }}
{{ HTML::script('js/App.js') }}

<!-- === Models === -->
{{ HTML::script('js/models/DashboardModel.js') }}
{{ HTML::script('js/models/PatternModel.js') }}
{{ HTML::script('js/models/ResultModel.js') }}

<!-- === Views === -->
{{ HTML::script('js/views/HeaderView.js') }}
{{ HTML::script('js/views/UploadView.js') }}
{{ HTML::script('js/views/DashboardView.js') }}
{{ HTML::script('js/views/PatternView.js') }}
{{ HTML::script('js/views/NotationView.js') }}
{{ HTML::script('js/views/ResultView.js') }}

<!-- === Controller === -->
{{ HTML::script('js/controllers/HeaderController.js') }}
{{ HTML::script('js/controllers/UploadController.js') }}
{{ HTML::script('js/controllers/DashboardController.js') }}
{{ HTML::script('js/controllers/PatternController.js') }}
{{ HTML::script('js/controllers/ResultController.js') }}
{{ HTML::script('js/controllers/ApplicationController.js') }}





<script type="text/javascript">
MusicXMLAnalyzer.init();
</script>