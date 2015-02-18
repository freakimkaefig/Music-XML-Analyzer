{{ HTML::script('libs/jquery-1.11.2/jquery-1.11.2.min.js') }}
{{ HTML::script('libs/bootstrap-3.3.2/dist/js/bootstrap.min.js') }}
{{ HTML::script('libs/d3-v3/d3.min.js') }}
{{ HTML::script('libs/d3-v3/d3pie.min.js') }}
{{ HTML::script('libs/vexflow/vexflow-min.js') }}
{{ HTML::script('libs/typed.js/js/typed.js') }}

{{ HTML::script('libs/dropzone-4.0.0/dist/min/dropzone.min.js') }}

{{ HTML::script('js/helpers/Route.js') }}

{{ HTML::script('js/App.js') }}

<!-- ===Models=== -->
{{ HTML::script('js/models/PatternModel.js') }}

<!-- === Models === -->
{{ HTML::script('js/models/DashboardModel.js') }}

<!-- === Views === -->
{{ HTML::script('js/views/HeaderView.js') }}
{{ HTML::script('js/views/UploadView.js') }}
{{ HTML::script('js/views/DashboardView.js') }}
{{ HTML::script('js/views/PatternView.js') }}
{{ HTML::script('js/views/NotationView.js') }}

<!-- === Controller === -->
{{ HTML::script('js/controllers/HeaderController.js') }}
{{ HTML::script('js/controllers/UploadController.js') }}
{{ HTML::script('js/controllers/DashboardController.js') }}
{{ HTML::script('js/controllers/PatternController.js') }}
{{ HTML::script('js/controllers/ApplicationController.js') }}





<script type="text/javascript">
MusicXMLAnalyzer.init();
</script>