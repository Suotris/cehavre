<footer></footer>



<?php
// We placed scripts retrieving wordpress essential functions here.
//TODO: use wp_localize_script to do it the proper way. cf:
//https://codex.wordpress.org/Function_Reference/wp_localize_script

?>
<!-- loading googlemaps scripts -->
<script src="https://maps.google.com/maps/api/js?key=%%API_KEY%%&sensor=false&libraries=places"></script>

<!-- loading soundcloud scripts -->
<script src="https://w.soundcloud.com/player/api.js" type="text/javascript"></script>

<script>

// USER INFO

    var is_admin = false;

    var current_user =
    <?php $current_user = wp_get_current_user();
        if( 0 === $current_user -> ID){
            echo('false; var nonce = null;');
        } else { echo
            '{"username": "'. $current_user->user_login . '",' .
            '"email": "' . $current_user->user_email . '",' .
            '"first_name": "' . $current_user->user_firstname . '",' .
            '"last_name": "' . $current_user->user_lastname . '",' .
            '"display_name": "' . $current_user->display_name . '",' .
            '"ID": "' . $current_user->ID . '"};'.
            'var nonce = "'.wp_create_nonce('wp_rest').'";';
        };?>

    angular.module('app')
    .constant('pages', {
        terms: <?php echo json_encode(get_post(%%TERMS%%));?>,
        about : <?php echo json_encode(get_post(%%ABOUT%%));?>
    })

</script>

<script type=text/ng-template id="my-profile.html">
    <div id="my-profile" class="row">
        <div id="my-profile-container" class="small-12 small-centered column">
            <div id="my-profile-title">
                <h3>Mon Profil</h3>
            </div>
            <div id="my-profile-main">
                <?php
                    echo do_shortcode('[wppb-edit-profile]');
                ?>
            </div>
        </div>
    </div>
</script>

<script type=text/ng-template id="login-modal.html">
    <div id="login-title"> <h3>Se connecter</h3> </div>
    <?php
        echo do_shortcode('[wppb-login]');
        //echo do_shortcode('[profilepress-login id="1" redirect="./terms"]');
        //echo wp_login_form();
    ?>
    <div class="login-options"><span ng-click="forgot = true">Mot de Passe Oublié?</span></div>
<div id="forgot-pw" ng-show="forgot">
    <?php
    echo do_shortcode('[wppb-recover-password]');
    ?>
</div>
</script>

<script type=text/ng-template id="logup-modal.html">
    <div class="login-header"><span ng-click="cancel()">fermer</span></div>
    <div id="logup-title"> <h3>S'enregistrer</h3></div>
</script>

<script type=text/ng-template id="logup.tpl.html">
    <div class="row">
        <div id="logup-container" class="small-12 small-centered columns">
            <div id="logup-title">
                <h3>S'enregistrer</h3>
            </div>
            <div id="logup-main" ng-if="!newlog">

                <?php echo do_shortcode('[wppb-register redirect_url="http://localhost/cehavre/wp/"]'); ?>

                <div><small>
                    En vous enregistrant, vous vous engagez à respecter les <a href="./terms#terms-title" ng-click="cancel()"> conditions générales d'utilisation </a> de ce site.
                </small></div>
                <div id="email-notice">
                    <div id="email-notice-title">
                    </div>
                    <small>
                    (1) Vous ne recevrez pas de messages non sollicités et votre adresse
                    ne sera jamais communiquée à des tiers. <a href="./terms#terms-title" ng-click="cancel()">Plus d'informations </a>
                    </small>
                </div>
            </div>
            <div id="logup-success" ng-if="newlog">
                <p>Votre nouveau compte a été créé avec succès!</p>
                <p>
                    Vous pouvez dès à présent <a href="./edit-story/new"> partager vos histoires </a> ou bien continuer à <a href="./">explorer notre ville</a> et les anecdotes qu'elle recèle.
                </p>
            </div>
        </div>
    </div>
</script>
